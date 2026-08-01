import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../services/api";
import "../../styles/checkInQR.css";

export default function CheckInQR() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMaDP, setCurrentMaDP] = useState("");

  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },

          async (decodedText) => {
            if (loading || booking) return;

            setLoading(true);

            try {
              console.log("QR RAW:", decodedText);

              let maDP = decodedText.trim();

              if (maDP.startsWith("http")) {
                const url = new URL(maDP);
                maDP = url.pathname.split("/").pop();
              }

              console.log("MaDP:", maDP);

              setCurrentMaDP(maDP);

              const res = await api.get(`/datphong/checkin/${maDP}`);

              console.log("Booking:", res.data);

              setBooking(res.data);

              if (isScanning.current) {
                await scanner.stop();
                isScanning.current = false;
              }
            } catch (err) {
              console.log(err);

              alert(
                err.response?.data?.message || "Không tìm thấy đơn đặt phòng",
              );
            } finally {
              setLoading(false);
            }
          },

          () => {},
        );

        isScanning.current = true;
      } catch (err) {
        console.log(err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isScanning.current) {
        scannerRef.current.stop().catch(() => {});

        isScanning.current = false;
      }
    };
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.put(`/datphong/${booking.MaPP}/check-in`);

      alert("✅ Check In thành công");

      window.location.reload();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Check In thất bại");
    }
  };

  const handleRescan = async () => {
    setBooking(null);
    setCurrentMaDP("");

    window.location.reload();
  };

  return (
    <div className="checkinqr-page">
      <h2>📷 Check In bằng QR</h2>

      {!booking && (
        <>
          <div id="reader" className="scanner-box" />

          {loading && <p className="loading">Đang lấy thông tin...</p>}
        </>
      )}

      {booking && (
        <div className="booking-card">
          <h3>🏨 Thông tin đặt phòng</h3>

          <div className="booking-info">
            <div>
              <b>📄 Mã đặt phòng</b>
              <span>{booking.MaDP}</span>
            </div>

            <div>
              <b>📦 Mã phân phòng</b>
              <span>{booking.MaPP}</span>
            </div>

            <div>
              <b>🏢 Chi nhánh</b>
              <span>{booking.TenCN}</span>
            </div>

            <div>
              <b>🛏️ Loại phòng</b>
              <span>{booking.TenLoai}</span>
            </div>

            <div>
              <b>🚪 Số phòng</b>
              <span>{booking.SoPhong}</span>
            </div>

            <div>
              <b>👥 Số người</b>
              <span>{booking.SoNguoi}</span>
            </div>

            <div>
              <b>📅 Ngày nhận</b>
              <span>
                {new Date(booking.NgayNhanPhong).toLocaleString("vi-VN")}
              </span>
            </div>

            <div>
              <b>📅 Ngày trả</b>
              <span>
                {new Date(booking.NgayTraPhong).toLocaleString("vi-VN")}
              </span>
            </div>

            <div>
              <b>📝 Trạng thái đặt</b>

              <span
                className={
                  booking.TrangThai === "đã xác nhận"
                    ? "status-success"
                    : "status-warning"
                }
              >
                {booking.TrangThai}
              </span>
            </div>

            <div>
              <b>🏨 Trạng thái phòng</b>

              <span
                className={
                  booking.TrangThaiPhanPhong === "đã giữ phòng"
                    ? "status-success"
                    : "status-warning"
                }
              >
                {booking.TrangThaiPhanPhong}
              </span>
            </div>

            <div>
              <b>🔖 Mã QR</b>
              <span>{currentMaDP}</span>
            </div>

            <div>
              <b>💰 Thanh toán</b>

              <span
                className={
                  booking.TrangThaiHoaDon === "đã thanh toán"
                    ? "status-success"
                    : "status-danger"
                }
              >
                {booking.TrangThaiHoaDon}
              </span>
            </div>
          </div>

          <div className="btn-group">
            <button className="btn-checkin" onClick={handleCheckIn}>
              ✅ Check In
            </button>

            <button className="btn-cancel" onClick={handleRescan}>
              🔄 Quét lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

export default function ThanhToan() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.bookingData;

  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    navigate("/khachhang/datphong");
    return null;
  }
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    return date.toLocaleDateString("vi-VN");
  };
  const handlePayment = async () => {
    try {
      setLoading(true);

      const payload = {
        ...bookingData,
        PhuongThucTT: paymentMethod,
      };

      const res = await api.post("/datphong", payload);

      setPaymentResult(res.data.payment);
    } catch (err) {
      alert(err.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  const qrUrl =
    paymentResult?.type === "bank"
      ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${paymentResult.qrContent}`
      : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#eef6ff 0%,#ffffff 100%)",
        padding: "140px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(15,76,129,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "24px",
            }}
          >
            Thông tin đặt phòng
          </h2>

          <InfoRow label="Chi nhánh" value={bookingData.MaCN} />
          <InfoRow label="Loại phòng" value={bookingData.MaLoai} />
          <InfoRow label="Phòng" value={bookingData.MaPhong} />
          <InfoRow
            label="Ngày nhận"
            value={formatDisplayDate(bookingData.NgayNhan)}
          />

          <InfoRow
            label="Ngày trả"
            value={formatDisplayDate(bookingData.NgayTra)}
          />
          <InfoRow label="Số người" value={bookingData.SoNguoi} />

          <div style={{ marginTop: "20px" }}>
            <h4>Dịch vụ thêm</h4>

            {bookingData.DichVu?.length > 0 ? (
              bookingData.DichVu.map((dv) => (
                <div
                  key={dv.MaDV}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span>{dv.TenDV}</span>
                  <span>{Number(dv.GiaDV).toLocaleString()} đ</span>
                </div>
              ))
            ) : (
              <p>Không chọn dịch vụ</p>
            )}
          </div>

          <div
            style={{
              marginTop: "30px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#1f4f8c",
            }}
          >
            Tổng tiền: {Number(bookingData.TongTien).toLocaleString()} đ
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(15,76,129,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "24px",
            }}
          >
            Thanh toán
          </h2>

          <PaymentOption
            label="Chuyển khoản ngân hàng"
            value="bank"
            selected={paymentMethod}
            setSelected={setPaymentMethod}
          />

          <PaymentOption
            label="MoMo"
            value="momo"
            selected={paymentMethod}
            setSelected={setPaymentMethod}
          />

          <PaymentOption
            label="VNPay"
            value="vnpay"
            selected={paymentMethod}
            setSelected={setPaymentMethod}
          />

          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%",
              height: "56px",
              border: "none",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#5d8df7,#1f4f8c)",
              color: "#fff",
              fontSize: "18px",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              height: "54px",
              width: "100%",
              border: "none",
              marginTop: "5px",
              borderRadius: "16px",
              background: "#eef2f7",
              cursor: "pointer",
            }}
          >
            Quay lại
          </button>

          {qrUrl && (
            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              <h3>Quét mã QR để thanh toán</h3>

              <img
                src={qrUrl}
                alt="QR Payment"
                style={{
                  marginTop: "20px",
                  borderRadius: "20px",
                }}
              />
            </div>
          )}

          {paymentResult?.paymentUrl && (
            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              <a
                href={paymentResult.paymentUrl}
                target="_blank"
                rel="noreferrer"
              >
                Đi tới cổng thanh toán
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "14px",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PaymentOption({ label, value, selected, setSelected }) {
  return (
    <label
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "16px",
        cursor: "pointer",
      }}
    >
      <input
        type="radio"
        checked={selected === value}
        onChange={() => setSelected(value)}
      />
      {label}
    </label>
  );
}

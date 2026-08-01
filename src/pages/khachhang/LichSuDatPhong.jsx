import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/LichSuDatPhong.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaStar, FaCheckCircle } from "react-icons/fa";
import { getRoomImageUrl } from "../../services/backend";

export default function LichSuDatPhong() {
  const [bookings, setBookings] = useState([]);
  const [reviewed, setReviewed] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadReviewed = async (list) => {
    const results = await Promise.all(
      list.map(async (item) => {
      try {
        const res = await api.get(`/danhgia/check/${item.MaDP}`);
        return [item.MaDP, res.data.reviewed];
      } catch {
        return [item.MaDP, false];
      }
      }),
    );

    setReviewed(Object.fromEntries(results));
  };

  const loadBookings = async () => {
    try {
      const res = await api.get("/datphong/my-bookings");

      setBookings(res.data);
      console.log(res.data);

      await loadReviewed(res.data);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + " đ";

  const formatDate = (date) => new Date(date).toLocaleString("vi-VN");

  if (loading) {
    return <div className="booking-history-loading">Đang tải...</div>;
  }

  return (
    <div className="booking-history">
      <h2>Lịch sử đặt phòng</h2>

      {bookings.length === 0 && (
        <div className="empty">Chưa có đơn đặt phòng</div>
      )}

      {bookings.map((item) => {
        const canReview =
          item.TrangThai === "trả phòng" || item.TrangThaiPhong === "trả phòng";

        return (
          <div className="booking-card" key={item.MaDP}>
            <img
              src={getRoomImageUrl(item.HinhAnh)}
              alt={item.TenLoai}
            />

            <div className="booking-content">
              <div className="booking-header">
                <h3>{item.TenLoai}</h3>

                <span
                  className={
                    "status " +
                    item.TrangThai.replaceAll(
                      " ",

                      "-",
                    )
                  }
                >
                  {item.TrangThai}
                </span>
              </div>

              <div className="booking-info">
                <p>
                  <strong>Phòng:</strong>

                  {item.SoPhong}
                </p>

                <p>
                  <strong>Loại đặt:</strong>

                  {item.LoaiDat}
                </p>

                <p>
                  <strong>Nhận:</strong>

                  {formatDate(item.NgayNhanPhong)}
                </p>

                <p>
                  <strong>Trả:</strong>

                  {formatDate(item.NgayTraPhong)}
                </p>

                <p>
                  <strong>Tổng tiền:</strong>

                  {formatMoney(item.ThanhTien)}
                </p>
              </div>
              <div className="booking-actions">
                {/* Xem chi tiết */}

                <button
                  className="btn-detail"
                  onClick={() => navigate(`/khachhang/booking/${item.MaDP}`)}
                >
                  <FaEye />
                  <span>Xem chi tiết</span>
                </button>

                {/* Viết đánh giá */}

                {canReview &&
                  (reviewed[item.MaDP] ? (
                    <button className="btn-reviewed" disabled>
                      <FaCheckCircle />
                      <span>Đã đánh giá</span>
                    </button>
                  ) : (
                    <button
                      className="btn-review"
                      onClick={() => navigate(`/khachhang/review/${item.MaDP}`)}
                    >
                      <FaStar />
                      <span>Viết đánh giá</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/Review.css";

export default function Review() {
  const { MaDP } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [summary, setSummary] = useState({
    DiemTB: 0,

    TongDanhGia: 0,
  });

  const [rating, setRating] = useState(5);

  const [hover, setHover] = useState(0);

  const [noiDung, setNoiDung] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // lấy chi tiết booking
      const bookingRes = await api.get(`/datphong/customer/detail/${MaDP}`);

      setBooking(bookingRes.data);

      const maLoai = bookingRes.data.MaLoai;

      // lấy thống kê
      const summaryRes = await api.get(`/danhgia/summary/${maLoai}`);

      setSummary(summaryRes.data);

      // lấy danh sách review
      const reviewRes = await api.get(`/danhgia/loaiphong/${maLoai}`);

      setReviews(reviewRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const ratingPercent = useMemo(() => {
    const total = summary.TongDanhGia || 1;

    const map = [0, 0, 0, 0, 0];

    reviews.forEach((r) => {
      map[r.SoSao - 1]++;
    });

    return map.map((x) => Math.round((x * 100) / total));
  }, [reviews, summary]);

  const handleSubmit = async () => {
    if (noiDung.trim() === "") {
      return alert("Vui lòng nhập nội dung.");
    }

    try {
      setLoading(true);

      await api.post(
        "/danhgia",

        {
          MaDP,

          SoSao: rating,

          NoiDung: noiDung,
        },
      );

      alert("Đánh giá thành công.");

      navigate("/khachhang/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Không thể gửi đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <div className="review-loading">Đang tải...</div>;
  }
  return (
    <div className="review-page">
      {/* ================= HEADER ================= */}

      <div className="review-banner">
        <h1>Đánh giá từ khách hàng</h1>

        <p>Mọi trải nghiệm của bạn đều giúp TealHaven phục vụ tốt hơn.</p>
      </div>

      <div className="review-wrapper">
        {/* ================= LEFT ================= */}

        <div className="review-left">
          <div className="summary-card">
            <div className="summary-score">{summary.DiemTB || 0}</div>

            <div className="summary-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(summary.DiemTB) ? "active" : ""}
                />
              ))}
            </div>

            <p>{summary.TongDanhGia} đánh giá</p>
          </div>

          <div className="rating-progress">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div className="progress-item" key={star}>
                <span>
                  {star}

                  <FaStar />
                </span>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${ratingPercent[star - 1]}%`,
                    }}
                  />
                </div>

                <strong>
                  {reviews.filter((r) => r.SoSao === star).length}
                </strong>
              </div>
            ))}
          </div>

          {/* ======= Review List ======= */}

          <div className="recent-title">Đánh giá gần đây</div>

          {reviews.length === 0 ? (
            <div className="empty-review">Chưa có đánh giá.</div>
          ) : (
            reviews.map((review) => (
              <div key={review.MaDG} className="review-item">
                <div className="review-avatar">
                  <FaUserCircle />
                </div>

                <div className="review-content">
                  <div className="review-top">
                    <h4>{review.HoTenKH}</h4>

                    <div>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.SoSao ? "active" : ""}
                        />
                      ))}
                    </div>
                  </div>

                  <small>
                    {new Date(review.NgayDG).toLocaleDateString("vi-VN")}
                  </small>

                  <p>{review.NoiDung}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= RIGHT ================= */}

        <div className="review-right">
          <div className="review-form">
            <h2>Viết đánh giá</h2>

            <p>
              Bạn vừa lưu trú tại
              <strong> {booking.TenLoai}</strong>
            </p>

            <div className="select-star">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;

                return (
                  <FaStar
                    key={value}
                    className={value <= (hover || rating) ? "active" : ""}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(value)}
                  />
                );
              })}
            </div>

            <textarea
              rows={8}
              placeholder="Hãy chia sẻ trải nghiệm của bạn..."
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-review-submit"
            >
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { FaStar, FaRegStar, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import "../../styles/RoomReview.css";

export default function RoomReview() {
  const { maLoai } = useParams();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    TongDanhGia: 0,
    DiemTB: 0,
    TenLoai: "",
  });

  useEffect(() => {
    loadData();
  }, [maLoai]);

  const loadData = async () => {
    try {
      const [reviewRes, summaryRes] = await Promise.all([
        api.get(`/danhgia/loaiphong/${maLoai}`),
        api.get(`/danhgia/summary/${maLoai}`),
      ]);

      setReviews(reviewRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="active" />
      ) : (
        <FaRegStar key={i} />
      ),
    );
  };

  const countStar = (star) => reviews.filter((r) => r.SoSao === star).length;

  return (
    <div>
      <div className="review-banner">
        <p>
          Đánh giá của khách hàng về loại phòng{" "}
          <span className="room-type-name">{summary.TenLoai}</span>
        </p>
      </div>

      <div className="review-wrapper">
        {/* LEFT */}
        <div className="review-left">
          <div className="recent-header">
            <h2 className="recent-title">Đánh giá gần đây</h2>

            <Link to={-1} className="back-btn">
              <FaArrowLeft />
              Quay lại
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-review">Chưa có đánh giá.</div>
          ) : (
            reviews.map((item) => (
              <div key={item.MaDG} className="review-item">
                <div className="review-avatar">
                  <FaUserCircle />
                </div>

                <div className="review-content">
                  <div className="review-top">
                    <h4>{item.HoTenKH}</h4>

                    <div>{renderStars(item.SoSao)}</div>
                  </div>

                  <small>
                    {new Date(item.NgayDG).toLocaleDateString("vi-VN")}
                  </small>

                  <p>{item.NoiDung}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="review-right">
          <div className="summary-card">
            <div className="summary-score">{summary.DiemTB || 0}</div>

            <div className="summary-stars">
              {renderStars(Math.round(summary.DiemTB || 0))}
            </div>

            <p>{summary.TongDanhGia} đánh giá</p>
          </div>

          <div className="progress-card">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = countStar(star);

              const percent =
                summary.TongDanhGia === 0
                  ? 0
                  : (count / summary.TongDanhGia) * 100;

              return (
                <div key={star} className="progress-item">
                  <span>
                    {star}
                    <FaStar />
                  </span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>

                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TypeRoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const selectedRoom = location.state?.selectedRoom || null;

  const selectedRoomType = location.state?.roomType || null;

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const res = await api.get(`/loaiphong/${id}`);
      setRoom(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!room)
    return (
      <div className="loading-wrap">
        <div className="loading-card">Đang tải thông tin phòng...</div>
      </div>
    );

  return (
    <div className="detail-page">
      <div className="detail-card">
        {/* LEFT IMAGE */}
        <div className="image-wrap">
          <img
            src={`/images/loaiphong/${room.HinhAnh}`}
            alt={room.TenLoai}
            onError={(e) => {
              e.target.src = "/images/loaiphong/default.jpg";
            }}
          />

          <div className="image-overlay"></div>

          <div className="image-badge">Premium Room</div>
        </div>

        {/* RIGHT INFO */}
        <div className="info-wrap">
          <p className="eyebrow">DANH SÁCH LOẠI PHÒNG Ở TEALHAVEN</p>

          <h1>{room.TenLoai}</h1>

          <p className="price">
            {Number(room.GiaPhong).toLocaleString()} VNĐ
            <span>/ đêm</span>
          </p>

          <p className="desc">
            {room.MoTa ||
              "Không gian nghỉ dưỡng sang trọng với đầy đủ tiện nghi cao cấp, mang lại trải nghiệm lưu trú đẳng cấp và thư giãn tuyệt đối."}
          </p>

          <div className="features">
            <div className="feature-card">
              <span>👥</span>
              <div>
                <strong>{room.SoNguoiToiDa || "N/A"}</strong>
                <p>Số khách tối đa</p>
              </div>
            </div>

            <div className="feature-card">
              <span>🛏️</span>
              <div>
                <strong>Luxury</strong>
                <p>Room Standard</p>
              </div>
            </div>

            <div className="feature-card">
              <span>✨</span>
              <div>
                <strong>Premium</strong>
                <p>Service Included</p>
              </div>
            </div>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() =>
                navigate("/khachhang/datphong", {
                  state: { roomType: room },
                })
              }
            >
              Đặt phòng ngay
            </button>

            <button
              className="btn-secondary"
              onClick={() =>
                navigate("/", {
                  state: { scrollTo: "ds-loaiphong" },
                })
              }
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        .detail-page {
          min-height: 100vh;
          padding: 70px 40px;
          background: linear-gradient(180deg, #f7fbff 0%, #edf4fb 100%);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .detail-card {
          width: 100%;
          max-width: 1500px;
          min-height: 700px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 30px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          box-shadow: 0 28px 70px rgba(15, 76, 129, 0.14);
          border: 1px solid rgba(220, 231, 245, 0.8);
        }

        .image-wrap {
          position: relative;
          overflow: hidden;
        }

        .image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .detail-card:hover .image-wrap img {
          transform: scale(1.04);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(15, 76, 129, 0.08),
            rgba(15, 76, 129, 0.28)
          );
        }

        .image-badge {
          position: absolute;
          top: 30px;
          left: 30px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #0f4c81;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }

        .info-wrap {
          padding: 70px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          font-size: 13px;
          letter-spacing: 3px;
          font-weight: 700;
          color: #4a90ff;
          margin-bottom: 16px;
        }

        .info-wrap h1 {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          line-height: 1.05;
          margin: 0 0 20px;
          color: #0d1b2a;
        }

        .price {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #4a90ff, #0f4c81);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }

        .price span {
          font-size: 18px;
          font-weight: 500;
        }

        .desc {
          color: #5f6f85;
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 35px;
        }

        .features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f7fbff, #ffffff);
          border: 1px solid #e3edf8;
        }

        .feature-card span {
          font-size: 26px;
        }

        .feature-card strong {
          font-size: 18px;
          color: #0d1b2a;
        }

        .feature-card p {
          margin: 4px 0 0;
          color: #7b8ca2;
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 16px;
          margin-top: 10px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 16px 30px;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4a90ff, #0f4c81);
          color: white;
          box-shadow: 0 14px 28px rgba(47, 128, 237, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: white;
          color: #0f4c81;
          border: 1px solid #dce7f5;
        }

        .btn-secondary:hover {
          background: #f4f9ff;
        }

        .loading-wrap {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f7fbff;
        }

        .loading-card {
          padding: 24px 36px;
          border-radius: 18px;
          background: white;
          box-shadow: 0 12px 30px rgba(15, 76, 129, 0.1);
          font-size: 18px;
          color: #0f4c81;
          font-weight: 600;
        }

        @media (max-width: 1100px) {
          .detail-card {
            grid-template-columns: 1fr;
          }

          .image-wrap {
            min-height: 400px;
          }

          .info-wrap {
            padding: 40px;
          }

          .info-wrap h1 {
            font-size: 46px;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

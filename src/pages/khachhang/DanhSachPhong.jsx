import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

const getImage = (img) => {
  if (!img) {
    return "https://placehold.co/600x400?text=No+Image";
  }
  // DB lưu abc.jpg
  if (!img.startsWith("/uploads")) {
    return `http://localhost:8080/uploads/loaiphong/${img}`;
  }
  // DB lưu /uploads/loaiphong/abc.jpg
  return `http://localhost:8080${img}`;
};

export default function DanhSachPhong() {
  const location = useLocation();
  const filters = location.state?.filters || {};
  const { maLoai } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(
    () => {
      fetchRooms();
    },
    [maLoai],
    location.state,
  );

  const fetchRooms = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/loaiphong/${maLoai}/phongs`,

        {
          params: {
            MaCN: filters.MaCN,

            NgayNhan: filters.NgayNhan,

            NgayTra: filters.NgayTra,

            LoaiDat: "theo ngày",
          },
        },
      );

      setRooms(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleBooking = (room) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // chưa đăng nhập
    if (!token || !user) {
      navigate("/login", {
        state: {
          redirectTo: "/khachhang/datphong",
          room,
          filters,
        },
      });
      return;
    }

    // đã đăng nhập
    navigate("/datphong", {
      state: { room, filters },
    });
  };
  const handleReview = (room) => {
    navigate(`/review/${room.MaLoai}`);
  };

  if (loading) {
    return (
      <>
        <div className="room-list-page">
          <h2>Đang tải danh sách phòng...</h2>
        </div>
      </>
    );
  }
  console.log("rooms state =", rooms);

  return (
    <>
      <div>
        <div className="room-list-header">
          <p className="eyebrow">CHI TIẾT LOẠI PHÒNG</p>
          {/* <h1>Danh sách phòng</h1>
          <p className="subtitle">Chọn căn phòng phù hợp với kỳ nghỉ của bạn</p> */}
        </div>

        {/* <div className="search-floating">
            <Select className="search-select"
              options={[
                { value: "", label: "Tất cả chi nhánh" },
                ...chiNhanh.map((cn) => ({
                  value: cn.MaCN,
                  label: cn.TenCN
                }))
              ]}
              defaultValue={{
                value: "",
                label: "Tất cả chi nhánh"
              }}
              onChange={(option) =>
                setFilters({
                  ...filters,
                  MaCN: option.value
                })
              }
              styles={selectStyles}
            />

            <Select className="search-select"
              options={[
                { value: "", label: "Tất cả loại phòng" },
                ...loaiPhong.map((lp) => ({
                  value: lp.MaLoai,
                  label: lp.TenLoai
                }))
              ]}
              defaultValue={{
                value: "",
                label: "Tất cả loại phòng"
              }}
              onChange={(option) =>
                setFilters({
                  ...filters,
                  MaLoai: option.value
                })
              }
              styles={selectStyles}
            />

            <DatePicker
              selectsRange
              startDate={filters.NgayNhan}
              endDate={filters.NgayTra}
              onChange={(dates) => {
                const [start, end] = dates;

                setFilters({
                  ...filters,
                  NgayNhan: start,
                  NgayTra: end
                });
              }}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Ngày nhận - Ngày trả"
              className="date-range-picker"
            />

            <button onClick={handleSearch}>Tìm kiếm</button>
          </div> */}

        <div className="room-list-container">
          {rooms.map((room) => (
            <div key={room.MaPhong} className="room-row-card">
              <div className="room-image">
                <img src={getImage(room.HinhAnh)} alt={room.TenLoai} />
              </div>

              <div className="room-info">
                <div className="room-main">
                  <h2>Phòng {room.SoPhong}</h2>
                  <p>{room.MoTa}</p>

                  <div className="room-features">
                    <span>🛏 {room.TenLoai}</span>
                    <span>🏢 Tầng {room.Tang}</span>
                    <span>👥 {room.SoNguoiToiDa} khách</span>
                    <span>📍 Chi nhánh {room.MaCN}</span>
                  </div>
                </div>

                <div className="room-price-box">
                  <div>
                    <small>Giá / đêm</small>
                    <h3>{Number(room.GiaPhong).toLocaleString("vi-VN")} VNĐ</h3>
                  </div>

                  <button
                    className="booking-btn"
                    onClick={() => handleBooking(room)}
                  >
                    Đặt phòng ngay
                  </button>
                  <button
                    className="review-btn"
                    onClick={() => handleReview(room)}
                  >
                    Xem đánh giá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
          .room-list-page {
            min-height: 100vh;
            padding: 40px;
            background: linear-gradient(180deg, #f7fbff 0%, #edf4fb 100%);
            font-family: "Inter", sans-serif;
          }

          .room-list-header {
            padding-top: 15px;
            text-align: center;
            padding-bottom: 30px;
          }

          .eyebrow {
            font-size: 13px;
            letter-spacing: 3px;
            font-weight: 700;
            color: #4a90ff;
            margin-bottom: 14px;
          }

          .room-list-header h1 {
            font-size: 50px;
            color: #0d1b2a;
            margin: 0;
            font-weight: 700;
            font-family: "Playfair Display", serif;
            line-height: 1.1;
          }

          .subtitle {
            max-width: 720px;
            margin: 10px auto 0;
            font-size: 17px;
            color: #64748b;
            line-height: 1.7;
          }

          .room-list-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .room-row-card {
            display: grid;
            grid-template-columns: 300px 1fr;
            background: rgba(255,255,255,0.96);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 12px 35px rgba(35,74,146,0.08);
            transition: 0.3s ease;
            min-height: 230px;
          }

          .room-image {
            width: 100%;
            height: 230px;
          }

          .room-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .room-info {
            padding: 24px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 30px;
          }

          .room-main {
            flex: 1;
          }

          .room-main h2 {
            font-family: "Playfair Display", serif;
            font-size: 34px;
            color: #0d1b2a;
            margin: 0 0 10px;
          }

          .room-main p {
            color: #6b7a90;
            font-size: 16px;
            margin: 0 0 18px;
          }

          .room-features {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .room-features span {
            background: #f5f8fc;
            border: 1px solid #dbe6f3;
            padding: 10px 16px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            color: #294d83;
          }

          .room-price-box {
            min-width: 180px;
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 16px;
          }

          .room-price-box small {
            color: #7d8ca3;
            font-size: 14px;
          }

          .room-price-box h3 {
            font-size: 25px;
            color: #29518f;
            margin: 0;
            line-height: 1.2;
          }

          .booking-btn {
            width: 180px;
            height: 52px;
            border: none;
            border-radius: 16px;
            background: linear-gradient(135deg, #4a90ff, #0f4c81);
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s ease;
          }
          .review-btn {
            text-decoration: none;
            color: #1e88e5;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .review-btn:hover {
            color: #29518f;
            transform: translateX(4px);
          }

          .booking-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px rgba(47,128,237,0.25);
          }

          @media (max-width: 992px) {
            .room-row-card {
              grid-template-columns: 1fr;
            }

            .room-image {
              height: 240px;
            }

            .room-info {
              flex-direction: column;
              align-items: flex-start;
            }

            .room-price-box {
              width: 100%;
              align-items: flex-start;
              text-align: left;
            }

            .booking-btn {
              width: 100%;
            }
          }
        `}</style>
    </>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export default function LoaiPhong() {
  const [roomTypes, setRoomTypes] = useState([]); // Danh sách đang hiển thị
  const [allRoomTypes, setAllRoomTypes] = useState([]); // Toàn bộ loại phòng (combobox)
  const [chiNhanh, setChiNhanh] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    MaCN: "",
    MaLoai: "",
    NgayNhan: null,
    NgayTra: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cnRes, lpRes] = await Promise.all([
          api.get("/chinhanh/public"),
          api.get("/loaiphong/public"),
        ]);

        setChiNhanh(cnRes.data);

        setRoomTypes(lpRes.data);
        setAllRoomTypes(lpRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // const loadRoomTypes = async () => {
  //   try {
  //     const res = await api.get("/loaiphong/public");
  //     setRoomTypes(res.data || []);
  //   } catch (err) {
  //     console.error("Lỗi load loại phòng:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getImage = (img) => {
    if (!img) {
      return "http://localhost:8080/uploads/loaiphong/default.jpg";
    }

    // nếu DB lưu:
    // abc.jpg
    if (!img.startsWith("/uploads")) {
      return `http://localhost:8080/uploads/loaiphong/${img}`;
    }

    // nếu DB lưu:
    // /uploads/loaiphong/abc.jpg
    return `http://localhost:8080${img}`;
  };

  const handleSearch = async () => {
    try {
      const res = await api.get("/loaiphong/filter", {
        params: {
          MaCN: filters.MaCN,
          MaLoai: filters.MaLoai,
          NgayNhan: filters.NgayNhan,
          NgayTra: filters.NgayTra,
        },
      });

      setRoomTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChiNhanhChange = async (option) => {
    const maCN = option.value;

    setFilters((prev) => ({
      ...prev,
      MaCN: maCN,
      MaLoai: "", // reset loại phòng
    }));

    if (!maCN) {
      setRoomTypes(allRoomTypes);
      return;
    }

    try {
      const res = await api.get("/loaiphong/public", {
        params: {
          MaCN: maCN,
        },
      });

      // chỉ cập nhật combobox
      setRoomTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const selectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
      flex: 1,
      minWidth: 0,
    }),

    control: (base, state) => ({
      ...base,
      width: "100%",
      minHeight: "52px",
      height: "52px",
      borderRadius: "12px",
      border: state.isFocused ? "1px solid #2f80ed" : "1px solid #d9e5f2",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(47,128,237,0.12)" : "none",
      backgroundColor: "#fff",
      fontSize: "15px",
      "&:hover": {
        border: "1px solid #2f80ed",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 14px",
      height: "52px",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#64748b",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#0d1b2a",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
    }),

    menu: (base) => ({
      ...base,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 12px 28px rgba(15,76,129,0.15)",
      zIndex: 9999,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
          ? "#eef6ff"
          : "#fff",
      color: state.isSelected ? "#fff" : "#0d1b2a",
      padding: "14px 16px",
      cursor: "pointer",
    }),
  };

  if (loading) {
    return (
      <div className="loading-wrap-lp">
        <div className="loading-card-lp">Đang tải danh sách loại phòng...</div>
      </div>
    );
  }

  return (
    <>
      <div className="roomtype-page-lp">
        <section className="hero-lp">
          <div className="search-floating">
            <Select
              className="search-select"
              options={[
                { value: "", label: "Tất cả chi nhánh" },
                ...chiNhanh.map((cn) => ({
                  value: cn.MaCN,
                  label: cn.TenCN,
                })),
              ]}
              defaultValue={{
                value: "",
                label: "Tất cả chi nhánh",
              }}
              onChange={handleChiNhanhChange}
              styles={selectStyles}
            />

            <Select
              className="search-select"
              options={[
                { value: "", label: "Tất cả loại phòng" },
                ...roomTypes.map((lp) => ({
                  value: lp.MaLoai,
                  label: lp.TenLoai,
                })),
              ]}
              value={{
                value: filters.MaLoai,
                label:
                  roomTypes.find((x) => x.MaLoai === filters.MaLoai)?.TenLoai ||
                  "Tất cả loại phòng",
              }}
              onChange={(option) =>
                setFilters((prev) => ({
                  ...prev,
                  MaLoai: option.value,
                }))
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
                  NgayTra: end,
                });
              }}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Ngày nhận - Ngày trả"
              className="date-range-picker"
            />

            <button onClick={handleSearch}>Tìm kiếm</button>
          </div>

          <p className="eyebrow-lp">DANH SÁCH LOẠI PHÒNG TẠI TEALHAVEN</p>
        </section>

        <section className="room-grid-lp">
          {roomTypes.map((item, index) => (
            <div className="room-card-lp" key={item.MaLoai}>
              <div className="img-wrap-lp">
                {/* <img
                  src={`/images/loaiphong/${item.HinhAnh}`}
                  alt={item.TenLoai}
                  onError={(e)=>{
                    e.target.src =
                      "/images/loaiphong/default.jpg";
                  }}
                />` */}
                <img
                  src={getImage(item.HinhAnh)}
                  alt={item.TenLoai}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />

                <div className="badge-lp">
                  {index % 2 === 0 ? "Premium" : "Best Choice"}
                </div>
              </div>

              <div className="card-body-lp">
                <h3>{item.TenLoai}</h3>

                <p className="desc-lp">
                  {item.MoTa || "Phòng nghỉ cao cấp với đầy đủ tiện nghi."}
                </p>

                <Link
                  className="button-xem-lp"
                  to={`/loaiphong/${item.MaLoai}/phongs`}
                >
                  Xem phòng →
                </Link>
              </div>
            </div>
          ))}
        </section>

        <style>{`
        .roomtype-page-lp {
          min-height: 100vh;
          font-family: "Inter", sans-serif;
        }

        .hero-lp {
          text-align: center;
          padding:25px 0 10px;
        }

        .eyebrow-lp {
          font-size: 13px;
          letter-spacing: 3px;
          font-weight: 700;
          color: #4a90ff;
          margin-bottom: 14px;
          padding-top: 10px;
        }

        .hero-lp h1 {
          font-size: 50px;
          color: #0d1b2a;
          margin: 0;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
          line-height: 1.1;
        }

        .subtitle-lp {
          max-width: 720px;
          margin: 10px auto 0;
          font-size: 17px;
          color: #64748b;
          line-height: 1.7;
        }

        .room-grid-lp{
            display:grid;

            grid-template-columns:repeat(3,380px);

            justify-content:center;

            gap:28px;

            max-width:1240px;

            margin:0 auto 0;

            padding:24px;
        }

        .room-card-lp{

            width:380px;

            background:#fff;

            border-radius:18px;

            overflow:hidden;

            border:1px solid #edf2f7;

            box-shadow:0 8px 24px rgba(15,23,42,.08);

            transition:.3s;
        }

        .img-wrap-lp {
          position: relative;
          height: 260px;
          overflow: hidden;
        }

        .img-wrap-lp img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.4s ease;
        }

        .badge-lp {
          position: absolute;
          top: 18px;
          left: 18px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: #0f4c81;
        }

        .card-body-lp {
          padding: 20px;
        }

        .card-body-lp h3 {
          margin: 0 0 12px;
          font-size: 28px;
          color: #0d1b2a;
        }

        .desc-lp {
          color: #64748b;
          line-height: 1.7;
          padding-bottom: 12px;
        }

        .info-row-lp {
          display: flex;
          justify-content: space-between;
          margin: 18px 0 22px;
          font-size: 15px;
          color: #334155;
          font-weight: 500;
        }

        .loading-wrap-lp {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f7fbff;
        }

        .loading-card-lp {
          padding: 24px 36px;
          border-radius: 18px;
          background: white;
          box-shadow: 0 12px 30px rgba(15, 76, 129, 0.1);
          font-size: 18px;
          font-weight: 600;
          color: #0f4c81;
        }
        .button-xem-lp {
          text-decoration: none;
          color: #1e88e5;
          font-size: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
          
        }

        .button-xem-lp:hover {
          color: #29518f;
          transform: translateX(4px);
        }

        .search-floating{

          width:60%;

          margin:0 auto 20px;

          background:#fff;

          border-radius:10px;

          padding:6px;

          display:flex;

          gap:12px;

          align-items:center;

          position:static;
      }
        .search-select {
          flex: 1;
          min-width: 0;
        }

        /* input + select đồng bộ */
        .react-datepicker__input-container input {
          width: 100%;
          height: 52px;
          border: 1px solid #d9e5f2;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 15px;
          color: #0d1b2a;
          background: #ffffff;
          box-sizing: border-box;
          font-family: Inter, sans-serif;
          outline: none;
          transition: 0.2s ease;
        }

        .react-datepicker__input-container input:focus {
          border-color: #2f80ed;
          box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.12);
        }

        /* datepicker wrapper fix */
        .react-datepicker-wrapper {
          flex: 1;
          width: 70%;
          min-width: 0;
        }

        .react-datepicker__input-container {
          width: 100%;
        }

        /* popup calendar */
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        /* chỉ style nút Search */
        .search-floating > button {
          width: 110px;
          height: 50px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #2f80ed, #0f4c81);;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s ease;
        }
        .search-floating > button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(47, 128, 237, 0.25);
        }

        .react-datepicker {
          border: none !important;
          border-radius: 18px !important;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(15, 76, 129, 0.18) !important;
          font-family: Inter, sans-serif !important;
        }

        .react-datepicker__header {
          background: linear-gradient(135deg, #4a90ff, #0f4c81) !important;
          border-bottom: none !important;
          padding: 16px 0 12px !important;
        }

        .react-datepicker__current-month {
          color: white !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }

        .react-datepicker__navigation {
          top: 18px !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: white !important;
          border-width: 2px 2px 0 0 !important;
        }

        .react-datepicker__day-names {
          background: white;
          margin-top: 0 !important;
          padding-top: 10px;
        }

        .react-datepicker__day-name {
          color: #64748b !important;
          font-weight: 600;
          width: 2.2rem !important;
          line-height: 2.2rem !important;
        }

        .react-datepicker__month {
          padding: 10px 12px 14px;
          margin: 0 !important;
        }

        .react-datepicker__day {
          width: 2.2rem !important;
          line-height: 2.2rem !important;
          border-radius: 10px !important;
          color: #0d1b2a !important;
          transition: 0.2s ease;
        }

        .react-datepicker__day:hover {
          background: #eef6ff !important;
          color: #2f80ed !important;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--keyboard-selected {
          background: linear-gradient(135deg, #4a90ff, #0f4c81) !important;
          color: white !important;
        }

        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background: linear-gradient(135deg, #2f80ed, #0f4c81) !important;
          color: white !important;
        }

        .react-datepicker__day--disabled {
          color: #cbd5e1 !important;
        }

        .react-datepicker__triangle {
          display: none !important;
        }
        .react-datepicker-popper {
          z-index: 9999 !important;
          margin-top: 10px !important;
        }

        @media (max-width: 768px) {
          .roomtype-page-lp {
              padding: 30px 20px 60px;
            }

          .hero-lp h1 {
            font-size: 36px;
          }
        }
      `}</style>
      </div>
    </>
  );
}

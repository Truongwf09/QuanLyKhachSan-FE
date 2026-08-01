import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaConciergeBell,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import suite from "../../assets/suite.jpg";
import buffet from "../../assets/buffet.jpg";
import letan from "../../assets/letan.jpg";
import ksan from "../../assets/sanhks.jpg";

export default function Home() {
  const [loaiPhong, setLoaiPhong] = useState([]);
  const [chiNhanh, setChiNhanh] = useState([]);
  const [filters, setFilters] = useState({
    MaCN: "",
    MaLoai: "",
    NgayNhan: null,
    NgayTra: null,
  });
  const navigate = useNavigate();

  const gallery = [
    {
      image: suite,
      title: "Phòng hiện đại",
      desc: "Không gian nghỉ dưỡng sang trọng.",
    },
    {
      image: ksan,
      title: "Nhiều chi nhánh",
      desc: "Hệ thống khách sạn trên nhiều tỉnh thành.",
    },
    {
      image: buffet,
      title: "Dịch vụ 5 sao",
      desc: "Buffet, hồ bơi, spa và nhiều tiện ích.",
    },
    {
      image: letan,
      title: "Đặt phòng an toàn",
      desc: "Thanh toán bảo mật và xác nhận nhanh.",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    (async () => {
      const [cnRes, lpRes] = await Promise.all([
        api.get("/chinhanh"),
        api.get("/loaiphong/public"),
      ]);
      console.log("Chi nhánh:", cnRes.data);
      console.log("Loại phòng:", lpRes.data);
      setChiNhanh(cnRes.data);
      setLoaiPhong(lpRes.data);
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % gallery.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const getImage = (img) => {
    if (!img) {
      return "https://placehold.co/600x400?text=No+Image";
    }
    if (!img.startsWith("/uploads")) {
      return `http://localhost:8080/uploads/loaiphong/${img}`;
    }
    return `http://localhost:8080${img}`;
  };

  const handleSearch = async () => {
    try {
      const res = await api.get("/loaiphong/filter", {
        params: filters,
      });
      console.log(res.data);
      setLoaiPhong(res.data);
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

  return (
    <>
      <div className="home-page">
        <section className="hero-shell">
          <div className="hero-content">
            <div className="hero-text">
              <span className="eyebrow">CHẠM TAY VÀO KỲ NGHỈ TRONG MƠ</span>
              <h1>TEALHAVEN</h1>
              <p>
                Khám phá hệ thống phòng nghỉ cao cấp, tiện ích đẳng cấp và những
                kỳ nghỉ đáng nhớ trên toàn bộ các chi nhánh của chúng tôi.
              </p>
            </div>
            <div className="hero-image">
              <img src="/images/banner.jpeg" alt="hotel" />
              <div className="overlay"></div>
            </div>
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
        </section>

        <section className="featured-section">
          <div className="section-head">
            <h2>Loại phòng nổi bật</h2>
            <Link to="/loaiphong" className="view-all-link">
              Xem tất cả
            </Link>
          </div>

          <div className="card-grid">
            {loaiPhong.slice(0, 4).map((lp) => (
              <div
                key={lp.MaLoai}
                className="room-card"
                onClick={() => navigate(`/loaiphong/${lp.MaLoai}/phongs`)}
              >
                <img src={getImage(lp.HinhAnh)} alt={lp.TenLoai} />
                <div className="card-body">
                  <h3>{lp.TenLoai}</h3>
                  <p>{lp.MoTa}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="why-section">
          <div className="section-head">
            <h2>Tại Tealhaven</h2>
            <Link to="/vechungtoi" className="view-all-link">
              Xem thêm
            </Link>
          </div>

          <div className="why-layout">
            <div className="gallery-panel">
              <img src={gallery[activeSlide].image} alt="" />

              <div className="gallery-overlay">
                <h3>{gallery[activeSlide].title}</h3>

                <p>{gallery[activeSlide].desc}</p>
              </div>

              <div className="gallery-dots">
                {gallery.map((_, i) => (
                  <span key={i} className={activeSlide === i ? "active" : ""} />
                ))}
              </div>
            </div>

            <div className="feature-list">
              <div
                className={
                  activeSlide === 0 ? "feature-card active" : "feature-card"
                }
                onClick={() => setActiveSlide(0)}
              >
                <FaHotel />

                <div>
                  <h3>Phòng hiện đại</h3>

                  <p>Hệ thống phòng nghỉ đa dạng, đầy đủ tiện nghi cao cấp.</p>
                </div>
              </div>

              <div
                className={
                  activeSlide === 1 ? "feature-card active" : "feature-card"
                }
                onClick={() => setActiveSlide(1)}
              >
                <FaMapMarkerAlt />

                <div>
                  <h3>Nhiều chi nhánh</h3>

                  <p>Dễ dàng lựa chọn địa điểm phù hợp.</p>
                </div>
              </div>

              <div
                className={
                  activeSlide === 2 ? "feature-card active" : "feature-card"
                }
                onClick={() => setActiveSlide(2)}
              >
                <FaConciergeBell />

                <div>
                  <h3>Dịch vụ 5 sao</h3>

                  <p>Đội ngũ chuyên nghiệp, phục vụ tận tâm.</p>
                </div>
              </div>

              <div
                className={
                  activeSlide === 3 ? "feature-card active" : "feature-card"
                }
                onClick={() => setActiveSlide(3)}
              >
                <FaShieldAlt />

                <div>
                  <h3>Đặt phòng an toàn</h3>

                  <p>Thanh toán bảo mật, xác nhận nhanh chóng.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="hotel-footer">
        <div className="footer-grid">
          <div>
            <h2>TEALHAVEN Hotel</h2>

            <p>
              Hệ thống khách sạn hiện đại, mang đến trải nghiệm nghỉ dưỡng đẳng
              cấp và tiện nghi.
            </p>
          </div>

          <div>
            <h3>Liên hệ</h3>

            <p>📍 TP. Hồ Chí Minh</p>

            <p>☎ 1900 xxxx</p>

            <p>✉ hotelphuonganh@gmail.com</p>
          </div>
        </div>

        <div className="copyright">© 2026 TEALHAVEN Hotel.</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        body {
          margin: 0;
          background: #f4f9ff;
          font-family: Inter, sans-serif;
        }
        .home-page {
          width: 100%;
          margin: 0 auto;
          padding: 0 32px 60px;
        }
        .hero-shell {
          position: relative;
          background: white;
          border-radius: 30px;
          overflow: visible;
          box-shadow: 0 20px 60px rgba(15, 76, 129, 0.12);
        }
        .hero-content {
          display: grid;
          grid-template-columns: 42% 58%;
          min-height: 500px;
        }
        .hero-text {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }
        .eyebrow {
          color: #1e88e5;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 700;
        }
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 65px;
          line-height: 1.05;
          color: #0d1b2a;
          margin: 16px 0;
          max-width: 520px;
        }
        .hero-text p {
          color: #4f6478;
          font-size: 18px;
          line-height: 1.8;
          max-width: 480px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 30px;
        }
        .primary-btn {
          background: #0f4c81;
          color: white;
          border: none;
          padding: 16px 30px;
          border-radius: 14px;
          font-weight: 600;
        }
        .ghost-btn {
          background: white;
          border: 1px solid #d6e7f7;
          color: #0f4c81;
          padding: 16px 30px;
          border-radius: 14px;
          font-weight: 600;
        }
        .hero-image {
          position: relative;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          overflow: hidden;
        }
        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 30%, rgba(15,76,129,0.08) 100%);
        }
        
        .search-floating {
          position: absolute;
          left: 50%;
          bottom: -42px;
          transform: translateX(-50%);
          width: 900px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 76, 129, 0.12);
          padding: 10px;
          display: flex;
          gap: 12px;
          z-index: 50;
          align-items: center;
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
          width: 100%;
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

        .featured-section {
          margin-top: 110px;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .section-head h2 {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          color: #0d1b2a;
          margin: 0;
        }
        .section-head span {
          color: #1e88e5;
          font-weight: 600;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .room-card{
            background:#fff;
            border-radius:22px;
            overflow:hidden;
            box-shadow:0 12px 30px rgba(15,76,129,.08);
        }

        .room-card img{
            width:100%;
            height:280px;
            object-fit:cover;
            object-position:center;
            transition:.35s;
        }

        .room-card:hover{
            transform:scale(1.02);
        }

        .card-body{
            padding:22px;
        }
        .card-body h3 {
          margin: 0 0 10px;
          color: #0d1b2a;
          font-size: 28px;
        }
        .card-body p {
          color: #1e88e5;
          font-weight: 700;
          margin: 0;
        }

        .view-all-link {
          text-decoration: none;
          color: #1e88e5;
          font-size: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-all-link:hover {
          color: #29518f;
          transform: translateX(4px);
        }

        .why-section{
            margin: 90px 0;
        }

        .why-title{
            text-align: center;
            margin-bottom: 40px;
        }

        .why-title span{
            display: inline-block;
            color: #3b82f6;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 4px;
            margin-bottom: 12px;
        }

        .why-title h2{
            font-family: "Playfair Display", serif;
            font-size: 46px;
            line-height: 1.2;
            color: #10233f;
            margin-bottom: 16px;
        }

        .why-title p{
            max-width: 700px;
            margin: auto;
            color: #64748b;
            font-size: 17px;
            line-height: 1.8;
        }

        /* ================= LAYOUT ================= */

        .why-layout{
            display: grid;
            grid-template-columns: 1fr 0.85fr;
            gap: 26px;
            align-items: stretch;
        }

        /* ================= GALLERY ================= */

        .gallery-panel{
            position: relative;
            width: 75%;
            height: 350px;
            overflow: hidden;
            border-radius: 15px;
            background: #f6f8fb;
            box-shadow: 0 10px 28px rgba(0,0,0,.08);
            margin-left: 100px;
        }

        .gallery-panel img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: .4s;
        }

        

        .gallery-overlay{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 24px 28px;
            background: linear-gradient(
                to top,
                rgba(0,0,0,.75),
                rgba(0,0,0,.35),
                transparent
            );
        }

        .gallery-overlay h3{
            color:#fff;
            font-size:28px;
            font-weight:700;
            margin-bottom:8px;
        }

        .gallery-overlay p{
            color:rgba(255,255,255,.9);
            font-size:16px;
            line-height:1.6;
        }

        /* ================= BUTTON ================= */

        .gallery-btn{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.95);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: .25s;
            box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }

        .gallery-btn:hover{
            background: #2f80ed;
            color: #fff;
        }

        .gallery-btn.left{
            left: 16px;
        }

        .gallery-btn.right{
            right: 16px;
        }

        /* ================= DOT ================= */

        .gallery-dots{
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
        }

        .gallery-dots span{
            width: 8px;
            height: 8px;
            border-radius: 20px;
            background: rgba(255,255,255,.45);
            transition: .3s;
        }

        .gallery-dots .active{
            width: 26px;
            background: #fff;
        }

        /* ================= FEATURE ================= */

        .feature-list{
            display: flex;
            flex-direction: column;
            gap: 14px;
            width: 80%;
        }

        .feature-card{
            display: flex;
            align-items: center;
            gap: 18px;

            background: #fff;

            padding: 10px;

            min-height: 78px;

            border-radius: 16px;

            border: 1px solid #edf2f7;

            box-shadow: 0 6px 18px rgba(15,76,129,.06);

            transition: all .25s ease;
        }

        .feature-card:hover,
        .feature-card.active{

            transform: translateX(6px);

            background: #f4f9ff;

            border-color: #d6e9ff;

            box-shadow: 0 12px 28px rgba(47,128,237,.10);

        }

        .feature-card svg{

            width: 22px;

            min-width: 22px;

            font-size: 22px;

            color: #10233f;

        }

        .feature-card h3{

            margin: 0 0 4px;

            font-size: 20px;

            font-weight: 700;

            color: #10233f;

        }

        .feature-card p{

            margin: 0;

            color: #64748b;

            font-size: 15px;

            line-height: 1.5;

        }

        .stats-section{

            margin:120px 0;

            display:grid;

            grid-template-columns:repeat(4,1fr);

            gap:25px;

        }

        .stat-box{

            background:white;

            padding:40px;

            border-radius:20px;

            text-align:center;

            box-shadow:0 12px 30px rgba(0,0,0,.07);

        }

        .stat-box h2{

            font-size:46px;

            color:#124b82;

            margin-bottom:10px;

        }

        .stat-box span{

            color:#64748b;

        }

        .hotel-footer {
          width: 100%; 
          margin: 0;              /* Tràn 100% chiều rộng màn hình */
          
          background: #10233f;       /* Giữ nguyên màu xanh tối sang trọng */
          color: white;
          border-radius: 0;          /* Loại bỏ bo góc tròn để sát sạt mép màn hình */
          padding: 25px;   /* Thu nhỏ padding cực gọn (trên/dưới giảm mạnh) */
          box-sizing: border-box;
        }

        /* Khung lưới chia cột */
        .footer-grid {
          width: 80%;                /* Đảm bảo nội dung chữ bên trong không bị dạt quá xa nhau trên màn hình lớn */
          margin: 0 auto;            /* Căn giữa cụm nội dung */
          display: grid;
          grid-template-columns: 2.5fr 1fr;
          gap: 40px;
        }

        .footer-grid h2 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;           /* Thu nhỏ tiêu đề TEALHAVEN Hotel */
          margin: 0 0 10px 0;
        }

        .footer-grid h3 {
          margin: 0 0 15px 0;
          font-size: 16px;           /* Thu nhỏ font của mục "Liên kết", "Liên hệ" */
          font-weight: 600;
          color: #d7e5f5;            /* Tạo điểm nhấn bằng màu xanh thương hiệu */
        }

        .footer-grid p {
          color: #d7e5f5;
          line-height: 1.6;
          font-size: 14px;           /* Thu nhỏ chữ nội dung */
          margin: 0 0 8px 0;
        }

        .footer-grid a {
          display: block;
          color: #d7e5f5;
          margin-bottom: 4px;        /* Khít hơn, bớt khoảng trống */
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-grid a:hover {
          color: #2f80ed;
        }

        /* Phần dòng bản quyền phía dưới cùng */
        .copyright {
          max-width: 1200px;
          margin: 25px auto 0;       /* Thu nhỏ khoảng cách với phần trên */
          padding-top: 15px;         /* Thu nhỏ padding của dòng copyright */
          border-top: 1px solid rgba(255, 255, 255, .1);
          text-align: center;
          color: #8fa0b5;
          font-size: 13px;
        }

        /* Tương thích mượt mà trên Mobile & Tablet */
        @media (max-width: 768px) {
          .hotel-footer {
            padding: 30px 20px 15px;
            width: 100%;
            margin-left: 0;
            margin-right: 0;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 1100px) {
          .hero-content { grid-template-columns: 1fr; }
          h1 { font-size: 48px; }
          .search-floating {
            position: static;
            transform: none;
            width: auto;
            margin: 20px;
            grid-template-columns: 1fr;
          }
          .card-grid { grid-template-columns: repeat(2,1fr); }
        }

        @media(max-width:992px){

            .why-layout{

                grid-template-columns:1fr;

            }

            .gallery-panel{

                height:300px;

            }

        }

        @media(max-width:768px){

            .why-title h2{

                font-size:34px;

            }

            .feature-card{

                padding:16px;

            }

            .gallery-panel{

                height:250px;

            }

        }
      `}</style>
    </>
  );
}

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function KhachHangLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // ===== LOAD AUTH =====
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    } else {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // cuộn xuống
        setShowNavbar(false);
      } else {
        // cuộn lên
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`kh-navbar ${showNavbar ? "navbar-show" : "navbar-hide"}`}
      >
        <img
          className="logo"
          src={logo}
          alt="TealHaven Hotel"
          onClick={() => navigate("/")}
        />

        <nav>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/loaiphong">Loại phòng</NavLink>
          <NavLink to="/datphong">Đặt phòng</NavLink>
          <NavLink to="/vechungtoi">Về chúng tôi</NavLink>
          <NavLink to="/lienhe">Liên hệ</NavLink>
        </nav>

        {/* ===== AUTH ===== */}
        <div className="auth">
          {!token ? (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          ) : (
            <div className="user-box">
              <div className="user-info" onClick={() => setShowMenu(!showMenu)}>
                Xin chào {user?.TenKH || "Khách"} 👋
              </div>

              {showMenu && (
                <div className="dropdown">
                  <div onClick={() => navigate("/khachhang/profile")}>
                    👤 Profile
                  </div>
                  <div onClick={() => navigate("/khachhang/my-bookings")}>
                    📖 Lịch sử đặt phòng
                  </div>
                  <div onClick={handleLogout}>🚪 Đăng xuất</div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      {/* ===== CSS ===== */}
      <style>{`
        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
          background: #eef4fb;
        }

        .kh-navbar{

            position:fixed;

            top:0;

            left:0;

            right:0;

            height:74px;

            padding:0 48px;

            display:flex;

            justify-content:space-between;

            align-items:center;

            background:rgba(255,255,255,.96);

            backdrop-filter:blur(16px);

            border-bottom:1px solid #edf2f7;

            box-shadow:0 2px 10px rgba(0,0,0,.04);

            z-index:1000;

            transition:.3s;

        }

        .navbar-show{

            transform:translateY(0);

            opacity:1;

        }

        .navbar-hide{

            transform:translateY(-100%);

            opacity:0;

        }

        .logo {
          width: auto;
          height: 55px;
          display: flex;
          cursor: pointer;
          transition: 0.25s ease;
          margin: 0;
          margin-left: 20px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 42px;
        }

        nav a {
          position: relative;
          text-decoration: none;
          color: #0d1b2a;
          font-size: 15px;
          font-weight: 500;
          transition: 0.25s ease;
          padding: 8px 0;
          font-family: "Inter", sans-serif;
        }

        nav a:hover {
          color: #2f80ed;
        }

        nav a.active {
          color: #0f4c81;
          font-weight: 500;
        }

        nav a.active::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 38px;
          height: 3px;
          border-radius: 20px;
          background: linear-gradient(135deg, #8ec5ff, #2f80ed);
        }

        .auth {
          display: flex;
          align-items: center;
        }

        .login-btn{

            height:44px;

            width:130px;

            padding:0 15px;

            border:none;

            border-radius:12px;

            background:linear-gradient(135deg,#4f86f7,#214f9c);

            color:#fff;

            font-size:15px;

            font-weight:500;

            letter-spacing:.3px;

            cursor:pointer;

            transition:.25s;

            box-shadow:0 6px 18px rgba(33,79,156,.18);

        }

        .login-btn:hover{

            transform:translateY(-2px);

            background:linear-gradient(135deg,#5b90fb,#2c5db4);

            box-shadow:0 10px 22px rgba(33,79,156,.28);

        }

        .user-box {
          position: relative;
        }

        .user-info {
          padding: 12px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eef6ff, #ffffff);
          border: 1px solid #dce7f5;
          color: #0f4c81;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .user-info:hover {
          box-shadow: 0 10px 20px rgba(15, 76, 129, 0.08);
        }

        .dropdown {
          position: absolute;
          top: 64px;
          right: 0;
          min-width: 200px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 18px 35px rgba(15, 76, 129, 0.15);
          border: 1px solid #e6eef8;
          overflow: hidden;
          z-index: 999;
        }

        .dropdown div {
          padding: 16px 18px;
          font-size: 15px;
          color: #0d1b2a;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .dropdown div:hover {
          background: #f4f9ff;
          color: #2f80ed;
        }

        .content {
          margin-top: 90px;
        }

        @media (max-width: 1100px) {
          .header-kh {
            width: calc(100% - 30px);
            padding: 14px 20px;
          }

          nav {
            gap: 20px;
          }

          nav a {
            font-size: 15px;
          }

          .login-btn {
            padding: 12px 20px;
          }
        }
      `}</style>
    </>
  );
}

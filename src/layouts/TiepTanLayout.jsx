import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/letan.css";
import dashboardIcon from "../assets/dashboard.png";
import bookingsIcon from "../assets/booking.png";
import checkinIcon from "../assets/checkin.png";
import checkoutIcon from "../assets/checkout.png";
import invoicesIcon from "../assets/invoice.png";
import servicesIcon from "../assets/service.png";
import calendarIcon from "../assets/calendar.png";

export default function ReceptionLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <h2 className="logo">TealHaven Hotel</h2>
        <NavLink to="/tieptan" end className="menu">
          <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
          Trang chủ
        </NavLink>

        <NavLink to="/tieptan/bookings" className="menu">
          <img src={bookingsIcon} alt="Đặt phòng" className="menu-icon" />
          Đặt phòng
        </NavLink>
        <NavLink to="/tieptan/checkinQR" className="menu">
          <img src={checkinIcon} alt="Check In QR" className="menu-icon" />
          Check In QR
        </NavLink>
        <NavLink to="/tieptan/checkin" className="menu">
          <img src={checkinIcon} alt="Nhận phòng" className="menu-icon" />
          Nhận phòng
        </NavLink>

        <NavLink to="/tieptan/checkout" className="menu">
          <img src={checkoutIcon} alt="Trả phòng" className="menu-icon" />
          Trả phòng
        </NavLink>

        <NavLink to="/tieptan/invoices" className="menu">
          <img src={invoicesIcon} alt="Hóa đơn" className="menu-icon" />
          Hóa đơn
        </NavLink>

        <NavLink to="/tieptan/services" className="menu">
          <img src={servicesIcon} alt="Dịch vụ" className="menu-icon" />
          Dịch vụ
        </NavLink>

        <NavLink to="/tieptan/calendar" className="menu">
          <img src={calendarIcon} alt="Lịch đặt phòng" className="menu-icon" />
          Lịch đặt phòng
        </NavLink>
      </div>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <h2>Trang làm việc của Nhân viên tiếp tân</h2>

          <div className="user-dropdown">
            <div className="user" onClick={() => setShowMenu(!showMenu)}>
              👤 {user?.HoTen}
              <span className="arrow">▼</span>
            </div>

            {showMenu && (
              <div className="dropdown-menu">
                <NavLink to="/tieptan/profile" className="dropdown-item">
                  Hồ sơ cá nhân
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="content-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

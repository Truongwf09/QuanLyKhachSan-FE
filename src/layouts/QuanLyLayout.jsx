import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/admin.css";
import dashboardIcon from "../assets/dashboard.png";
import employeeIcon from "../assets/people.png";
import accountsIcon from "../assets/account.png";
import roomsIcon from "../assets/room.png";
import roomTypesIcon from "../assets/bed.png";
import calendarIcon from "../assets/calendar.png";
import customersIcon from "../assets/customer.png";
import servicesIcon from "../assets/service.png";
export default function StaffLayout() {
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

        <NavLink to="/quanly" end className="menu">
          <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
          Trang chủ
        </NavLink>
        <NavLink to="/quanly/employees" className="menu">
          <img src={employeeIcon} alt="Nhân viên" className="menu-icon" />
          Nhân viên
        </NavLink>
        <NavLink to="/quanly/accounts" className="menu">
          <img src={accountsIcon} alt="Tài khoản" className="menu-icon" />
          Tài khoản
        </NavLink>
        <NavLink to="/quanly/customers" className="menu">
          <img src={customersIcon} alt="Khách hàng" className="menu-icon" />
          Khách hàng
        </NavLink>
        <NavLink to="/quanly/DichVu" className="menu">
          <img src={servicesIcon} alt="Dịch Vụ" className="menu-icon" />
          Dịch Vụ
        </NavLink>
        <NavLink to="/quanly/rooms" className="menu">
          <img src={roomsIcon} alt="Phòng" className="menu-icon" />
          Phòng
        </NavLink>
        <NavLink to="/quanly/room-types" className="menu">
          <img src={roomTypesIcon} alt="Loại phòng" className="menu-icon" />
          Loại phòng
        </NavLink>
        <NavLink to="/quanly/calendar" className="menu">
          <img src={calendarIcon} alt="Lịch đặt phòng" className="menu-icon" />
          Lịch đặt phòng
        </NavLink>
      </div>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <h2>Trang quản trị của Quản lý chi nhánh</h2>

          <div className="user-dropdown">
            <div className="user" onClick={() => setShowMenu(!showMenu)}>
              👤 {user?.HoTen}
              <span className="arrow">▼</span>
            </div>

            {showMenu && (
              <div className="dropdown-menu">
                <NavLink to="/quanly/profile" className="dropdown-item">
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

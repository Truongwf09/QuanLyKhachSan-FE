import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import "../styles/admin.css";
import dashboardIcon from "../assets/dashboard.png";
import chinhanhIcon from "../assets/location.png";
import employeeIcon from "../assets/people.png";
import roomsIcon from "../assets/room.png";
import roomTypesIcon from "../assets/bed.png";
import reviewIcon from "../assets/review.png";

export default function AdminLayout() {
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

        <NavLink to="/admin" end className="menu">
          <img src={dashboardIcon} alt="dashboard" className="menu-icon" />
          Trang chủ
        </NavLink>

        <NavLink to="/admin/chinhanh" className="menu">
          <img src={chinhanhIcon} alt="chinhanh" className="menu-icon" />
          Chi nhánh
        </NavLink>
        <NavLink to="/admin/nhanvien" className="menu">
          <img src={employeeIcon} alt="nhanvien" className="menu-icon" />
          Nhân viên
        </NavLink>
        <NavLink to="/admin/chucvu" className="menu">
          <img src={employeeIcon} alt="chucvu" className="menu-icon" />
          Chức vụ
        </NavLink>
        <NavLink to="/admin/quyen" className="menu">
          <img src={employeeIcon} alt="quyen" className="menu-icon" />
          Quyền
        </NavLink>
        <NavLink to="/admin/phong" className="menu">
          <img src={roomsIcon} alt="phong" className="menu-icon" />
          Phòng
        </NavLink>
        <NavLink to="/admin/loaiphong" className="menu">
          <img src={roomTypesIcon} alt="loaiphong" className="menu-icon" />
          Loại phòng
        </NavLink>
        <NavLink to="/admin/danhgia" className="menu">
          <img src={reviewIcon} alt="danhgia" className="menu-icon" />
          Đánh giá
        </NavLink>
      </div>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <h2>Trang quản trị của Admin</h2>

          <div className="user-dropdown">
            <div className="user" onClick={() => setShowMenu(!showMenu)}>
              👤 {user?.HoTen}
              <span className="arrow">▼</span>
            </div>

            {showMenu && (
              <div className="dropdown-menu">
                <NavLink to="/admin/profile" className="dropdown-item">
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

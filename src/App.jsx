import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Layout */
import AdminLayout from "./layouts/AdminLayout";
import QuanLyLayout from "./layouts/QuanLyLayout";
import TiepTanLayout from "./layouts/TiepTanLayout";
import KhachHangLayout from "./layouts/KhachHangLayout";

/* Auth */
import LoginKH from "./pages/khachhang/LoginKH";
import Register from "./pages/khachhang/Register";

/* Admin */
import Dashboard from "./pages/admin/Dashboard";
import ChiNhanh from "./pages/admin/ChiNhanh";
import NhanVien from "./pages/admin/NhanVien";
import PhongAd from "./pages/admin/RoomsAd";
import LoaiPhongAd from "./pages/admin/RoomTypesAd";
import ChucVu from "./pages/admin/ChucVu";
import Quyen from "./pages/admin/Quyen";
import DanhGia from "./pages/admin/DanhGia";
import ProfileAd from "./pages/admin/ProfileAd";
/* Quản lý */
import DashboardQL from "./pages/quanly/DashboardQL";
import Employees from "./pages/quanly/Employees";
import Accounts from "./pages/quanly/Accounts";
import Customers from "./pages/quanly/Customers";
import Rooms from "./pages/quanly/Rooms";
import RoomTypes from "./pages/quanly/RoomTypes";
import BookingCalendarQL from "./pages/quanly/BookingCalendarQL";
import DichVuQL from "./pages/quanly/DichVu"
import ProfileQL from "./pages/quanly/ProfileQL";
/* Lễ tân */
import Bookings from "./pages/tieptan/Bookings";
import CheckIn from "./pages/tieptan/Checkin";
import CheckOut from "./pages/tieptan/Checkout";
import Services from "./pages/tieptan/Services";
import BookingCalendarLT from "./pages/tieptan/BookingCalendarLT";
import DashboardLT from "./pages/tieptan/DashboardLT";
import HoaDonLT from "./pages/tieptan/HoaDonLT";
import CheckInQR from "./pages/tieptan/CheckInQR";
import ProfileLeTan from "./pages/tieptan/ProfileLeTan";

/* Khách hàng */
import Home from "./pages/khachhang/Home";
import Profile from "./pages/khachhang/Profile";
import TypeRoomDetail from "./pages/khachhang/TypeRoomDetail";
import DatPhong from "./pages/khachhang/DatPhong";
import LoaiPhong from "./pages/khachhang/LoaiPhong";
import DanhSachPhong from "./pages/khachhang/DanhSachPhong";
import ThanhToan from "./pages/khachhang/ThanhToan";
import LichSuDatPhong from "./pages/KhachHang/LichSuDatPhong";
//import DanhSachPhong from "./pages/khachhang/DanhSachPhong";
//import ChiTietPhong from "./pages/khachhang/ChiTietPhong";
import ChiTietDatPhong from "./pages/khachhang/ChiTietDatPhong";
import Review from "./pages/khachhang/Review"
import RoomReview from "./pages/khachhang/RoomReview"
import About from "./pages/khachhang/About";
import Contact from "./pages/khachhang/Contact";
import BookingDetailQR from "./pages/khachhang/BookingDetailQR";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<KhachHangLayout />}>
          <Route index element={<Home />} />
          <Route path="loaiphong" element={<LoaiPhong />} />
          <Route path="vechungtoi" element={<About />} />
          <Route path="lienhe" element={<Contact />} />
          <Route path="loaiphong/:maLoai/phongs" element={<DanhSachPhong />} />
          <Route path="datphong" element={<DatPhong />} />
          <Route path="khachhang/thanhtoan" element={<ThanhToan />} />
          <Route
            path="review/:maLoai"
            element={<RoomReview />}
          />

        </Route>

        {/* ================= LOGIN KHÁCH ================= */}

        <Route path="/login" element={<LoginKH />} />
        <Route path="/register" element={<Register />} />

        {/* PUBLIC ĐẶT PHÒNG */}


        {/* ================= KHÁCH LOGIN ================= */}

        <Route
          path="/khachhang"
          element={
            <ProtectedRoute roles={["khachhang"]}>
              <KhachHangLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="my-bookings"
            element={<LichSuDatPhong />}
          />
          <Route
            path="booking/:MaDP"
            element={<ChiTietDatPhong />}
          />
          <Route
            path="review/:MaDP"
            element={<Review />}
          />
          <Route
            path="booking/:id"
            element={<BookingDetailQR />}
          />

        </Route>




        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="chinhanh"
            element={<ChiNhanh />}
          />

          <Route
            path="nhanvien"
            element={<NhanVien />}
          />
          <Route
            path="phong"
            element={<PhongAd />}
          />
          <Route
            path="profile"
            element={<ProfileAd />}
          />
          <Route path="chucvu" element={<ChucVu />} />
          <Route path="quyen" element={<Quyen />} />
          <Route
            path="loaiphong"
            element={<LoaiPhongAd />}
          />
          <Route
            path="danhgia"
            element={<DanhGia />}
          />

        </Route>




        {/* ================= QUẢN LÝ ================= */}

        <Route
          path="/quanly"
          element={
            <ProtectedRoute roles={["quanly"]}>
              <QuanLyLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<DashboardQL />}
          />

          <Route
            path="employees"
            element={<Employees />}
          />

          <Route
            path="accounts"
            element={<Accounts />}
          />
          <Route
            path="profile"
            element={<ProfileQL />}
          />
          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="rooms"
            element={<Rooms />}
          />

          <Route
            path="room-types"
            element={<RoomTypes />}
          />

          <Route
            path="calendar"
            element={<BookingCalendarQL />}
          />
          <Route
            path="DichVu"
            element={<DichVuQL />}
          />

        </Route>





        {/* ================= TIẾP TÂN ================= */}

        <Route
          path="/tieptan"
          element={
            <ProtectedRoute roles={["tiep_tan"]}>
              <TiepTanLayout />
            </ProtectedRoute>
          }
        >

          {/* chờ phân phòng */}
          <Route
            index
            element={<DashboardLT />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          {/* đã phân phòng -> chờ checkin */}
          <Route
            path="checkin"
            element={<CheckIn />}
          />
          <Route
            path="profile"
            element={<ProfileLeTan />}
          />
          <Route
            path="checkinQR"
            element={<CheckInQR />}
          />

          {/* đang ở -> checkout */}
          <Route
            path="checkout"
            element={<CheckOut />}
          />

          <Route
            path="invoices"
            element={<HoaDonLT />}
          />

          <Route
            path="services"
            element={<Services />}
          />

          <Route
            path="calendar"
            element={<BookingCalendarLT />}
          />
        </Route>



      </Routes>

    </BrowserRouter>
  );

}

export default App;

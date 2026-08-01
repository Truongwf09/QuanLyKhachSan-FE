import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Login = lazy(() => import("./pages/auth/Login"));
import ProtectedRoute from "./routes/ProtectedRoute";

/* Layout */
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const QuanLyLayout = lazy(() => import("./layouts/QuanLyLayout"));
const TiepTanLayout = lazy(() => import("./layouts/TiepTanLayout"));
const KhachHangLayout = lazy(() => import("./layouts/KhachHangLayout"));

/* Auth */
const LoginKH = lazy(() => import("./pages/khachhang/LoginKH"));
const Register = lazy(() => import("./pages/khachhang/Register"));

/* Admin */
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ChiNhanh = lazy(() => import("./pages/admin/ChiNhanh"));
const NhanVien = lazy(() => import("./pages/admin/NhanVien"));
const PhongAd = lazy(() => import("./pages/admin/RoomsAd"));
const LoaiPhongAd = lazy(() => import("./pages/admin/RoomTypesAd"));
const ChucVu = lazy(() => import("./pages/admin/ChucVu"));
const Quyen = lazy(() => import("./pages/admin/Quyen"));
const DanhGia = lazy(() => import("./pages/admin/DanhGia"));
const ProfileAd = lazy(() => import("./pages/admin/ProfileAd"));
/* Quản lý */
const DashboardQL = lazy(() => import("./pages/quanly/DashboardQL"));
const Employees = lazy(() => import("./pages/quanly/Employees"));
const Accounts = lazy(() => import("./pages/quanly/Accounts"));
const Customers = lazy(() => import("./pages/quanly/Customers"));
const Rooms = lazy(() => import("./pages/quanly/Rooms"));
const RoomTypes = lazy(() => import("./pages/quanly/RoomTypes"));
const BookingCalendarQL = lazy(() => import("./pages/quanly/BookingCalendarQL"));
const DichVuQL = lazy(() => import("./pages/quanly/DichVu"));
const ProfileQL = lazy(() => import("./pages/quanly/ProfileQL"));
/* Lễ tân */
const Bookings = lazy(() => import("./pages/tieptan/Bookings"));
const CheckIn = lazy(() => import("./pages/tieptan/Checkin"));
const CheckOut = lazy(() => import("./pages/tieptan/Checkout"));
const Services = lazy(() => import("./pages/tieptan/Services"));
const BookingCalendarLT = lazy(() => import("./pages/tieptan/BookingCalendarLT"));
const DashboardLT = lazy(() => import("./pages/tieptan/DashboardLT"));
const HoaDonLT = lazy(() => import("./pages/tieptan/HoaDonLT"));
const CheckInQR = lazy(() => import("./pages/tieptan/CheckInQR"));
const ProfileLeTan = lazy(() => import("./pages/tieptan/ProfileLeTan"));

/* Khách hàng */
const Home = lazy(() => import("./pages/khachhang/Home"));
const Profile = lazy(() => import("./pages/khachhang/Profile"));
const DatPhong = lazy(() => import("./pages/khachhang/DatPhong"));
const LoaiPhong = lazy(() => import("./pages/khachhang/LoaiPhong"));
const DanhSachPhong = lazy(() => import("./pages/khachhang/DanhSachPhong"));
const ThanhToan = lazy(() => import("./pages/khachhang/ThanhToan"));
const LichSuDatPhong = lazy(() => import("./pages/khachhang/LichSuDatPhong"));
//import DanhSachPhong from "./pages/khachhang/DanhSachPhong";
//import ChiTietPhong from "./pages/khachhang/ChiTietPhong";
const ChiTietDatPhong = lazy(() => import("./pages/khachhang/ChiTietDatPhong"));
const Review = lazy(() => import("./pages/khachhang/Review"));
const RoomReview = lazy(() => import("./pages/khachhang/RoomReview"));
const About = lazy(() => import("./pages/khachhang/About"));
const Contact = lazy(() => import("./pages/khachhang/Contact"));
const BookingDetailQR = lazy(() => import("./pages/khachhang/BookingDetailQR"));

function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-loading" aria-live="polite">Đang tải...</div>}>

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
      </Suspense>

    </BrowserRouter>
  );

}

export default App;

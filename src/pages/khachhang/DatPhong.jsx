import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import background from "../../assets/background.jpeg";

export default function DatPhong() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Lấy thông tin phòng nếu đi từ trang Chi tiết phòng
  const selectedRoomFromState =
    location.state?.room && location.state.room.MaPhong
      ? location.state.room
      : null;
  const filtersFromState = location.state?.filters || {};
  const isDirectBooking = !selectedRoomFromState;

  // Quản lý các bước: 1: Chọn phòng -> 2: Thông tin -> 3: Dịch vụ -> 4: Xác nhận -> 5: Thành công
  const [currentStep, setCurrentStep] = useState(1);

  // Data từ API
  const [chiNhanh, setChiNhanh] = useState([]);
  const [loaiPhongList, setLoaiPhongList] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [dichVuList, setDichVuList] = useState([]);

  // State quản lý việc lựa chọn của Khách hàng
  const [selectedCN, setSelectedCN] = useState(
    selectedRoomFromState?.MaCN || filtersFromState.MaCN || "",
  );
  const [selectedLoaiPhong, setSelectedLoaiPhong] = useState(
    selectedRoomFromState?.MaLoai || filtersFromState.MaLoai || "",
  );
  const [selectedRoom, setSelectedRoom] = useState(selectedRoomFromState);

  // Thời gian lưu trú
  const [loaiDat, setLoaiDat] = useState(
    selectedRoomFromState
      ? "theo ngày"
      : filtersFromState.LoaiDat || "theo ngày",
  );
  const [dateRange, setDateRange] = useState([
    filtersFromState.NgayNhan ? new Date(filtersFromState.NgayNhan) : null,
    filtersFromState.NgayTra ? new Date(filtersFromState.NgayTra) : null,
  ]);
  const [startDate, endDate] = dateRange;
  const [soGio, setSoGio] = useState(filtersFromState.SoGio || 2);

  // Số lượng dịch vụ: { [MaDV]: SoLuong }
  const [serviceQuantities, setServiceQuantities] = useState({});

  // Thông tin khách hàng (Bước 2)
  const [customerInfo, setCustomerInfo] = useState({
    HoTen: "",
    SDT: "",
    Email: "",
    SoNguoi: 1,
    GhiChu: "",
  });

  // Lưu thông tin tài khoản khách hàng
  const [customerProfile, setCustomerProfile] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("banking");
  const [errors, setErrors] = useState({});
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [waitingPayment, setWaitingPayment] = useState(false);

  // Định dạng ngày để gửi lên API (YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm:00)
  const formatDate = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
  };

  const formatVND = (amount) => {
    return Number(amount || 0).toLocaleString("vi-VN") + "đ";
  };

  // Tính số đêm lưu trú công thức thực tế
  const soDem = (() => {
    if (loaiDat !== "theo ngày" || !startDate || !endDate) return 0;
    const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  })();

  // --- EFFECT 1: KIỂM TRA ĐĂNG NHẬP & TẢI CHI NHÁNH BẢO MẬT ---
  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện đặt phòng");
      navigate("/login");
      return;
    }
    loadCustomerProfile();

    // Gọi API lấy danh sách chi nhánh công khai
    api
      .get("/chinhanh/public")
      .then((res) => {
        // Nếu API bọc trong res.data.data thì lấy res.data.data, ngược lại lấy res.data
        const data = res.data?.data || res.data;
        const list = Array.isArray(data) ? data : [];
        setChiNhanh(list);

        if (!selectedRoomFromState && filtersFromState.MaCN) {
          const branchExists = list.some((cn) => cn.MaCN === filtersFromState.MaCN);
          if (branchExists) {
            setSelectedCN(filtersFromState.MaCN);
          }
        }
      })
      .catch((err) => console.error("Lỗi lấy chi nhánh:", err));

    // Nếu chuyển hướng từ trang Chi tiết của 1 phòng cụ thể qua
    if (selectedRoomFromState) {
      setSelectedCN(selectedRoomFromState.MaCN);
      setSelectedLoaiPhong(selectedRoomFromState.MaLoai);
      loadDichVuTheoCN(selectedRoomFromState.MaCN);
    } else if (filtersFromState.MaCN) {
      loadDichVuTheoCN(filtersFromState.MaCN);
    }
  }, []);

  useEffect(() => {
    if (
      !selectedRoomFromState &&
      filtersFromState.MaCN &&
      chiNhanh.length > 0 &&
      !selectedCN
    ) {
      setSelectedCN(filtersFromState.MaCN);
      if (filtersFromState.MaLoai) {
        setSelectedLoaiPhong(filtersFromState.MaLoai);
      }
    }
  }, [chiNhanh, filtersFromState, selectedCN, selectedRoomFromState]);

  // --- EFFECT 2: TỰ ĐỘNG TẢI LOẠI PHÒNG & DỊCH VỤ THEO CHI NHÁNH ĐÃ CHỌN ---
  useEffect(() => {
    if (isDirectBooking && selectedCN) {
      // Tải danh sách loại phòng thuộc chi nhánh
      api
        .get("/loaiphong/filter", { params: { MaCN: selectedCN } })
        .then((res) => {
          const data = res.data?.data || res.data;
          setLoaiPhongList(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Lỗi lấy loại phòng:", err));

      loadDichVuTheoCN(selectedCN);

      // Reset phòng khi đổi chi nhánh
      setSelectedLoaiPhong("");
      setSelectedRoom(null);
      setAvailableRooms([]);
    }
  }, [selectedCN]);

  const loadDichVuTheoCN = (maCN) => {
    api
      .get(`/dichvu/public?MaCN=${maCN}`)
      .then((res) => {
        const data = res.data?.data || res.data;
        setDichVuList(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Lỗi lấy dịch vụ:", err));
    setServiceQuantities({});
  };

  const loadCustomerProfile = async () => {
    try {
      const res = await api.get("/khachhang/profile");

      const kh = res.data?.data || res.data;

      setCustomerProfile(kh);

      setCustomerInfo((prev) => ({
        ...prev,
        HoTen: kh.HoTen || kh.HoTenKH || "",
        SDT: kh.SDT || "",
        Email: kh.Email || "",
      }));
    } catch (err) {
      console.error("Không lấy được thông tin khách hàng", err);
    }
  };

  // --- EFFECT 3: TỰ ĐỘNG TÌM PHÒNG TRỐNG (API CHỦ LỰC /phong/trong) ---
  useEffect(() => {
    if (!isDirectBooking || !selectedCN || !selectedLoaiPhong) return;

    // Chặn gọi API khi chưa nhập đủ ngày lưu trú phù hợp để tránh lỗi 400 Bad Request
    const ngayNhanStr =
      loaiDat === "theo ngày"
        ? formatDate(startDate)
        : formatDateTime(startDate);
    const ngayTraStr = loaiDat === "theo ngày" ? formatDate(endDate) : "";

    if (!ngayNhanStr || (loaiDat === "theo ngày" && !ngayTraStr)) {
      setAvailableRooms([]);
      return;
    }

    // Gọi API lấy phòng trống
    api
      .get("/phong/trong", {
        params: {
          MaCN: selectedCN,
          MaLoai: selectedLoaiPhong,
          NgayNhan: ngayNhanStr,
          NgayTra: ngayTraStr,
          LoaiDat: loaiDat,
          SoGio: soGio,
          SoNguoi: customerInfo.SoNguoi,
        },
      })
      .then((res) => {
        const rooms = res.data || [];

        setAvailableRooms(rooms);

        if (selectedRoom) {
          const found = rooms.find((r) => r.MaPhong === selectedRoom.MaPhong);

          if (!found) {
            setSelectedRoom(null);
          }
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách phòng trống:", err));
  }, [
    selectedCN,
    selectedLoaiPhong,
    startDate,
    endDate,
    loaiDat,
    soGio,
    customerInfo.SoNguoi,
  ]);

  // --- TÍNH TOÁN GIÁ TIỀN REAL-TIME ---
  const tienPhongRaw = (() => {
    if (!selectedRoom) return 0;
    if (loaiDat === "theo ngày")
      return Number(selectedRoom.GiaPhong || 0) * soDem;
    if (loaiDat === "theo giờ")
      return Number(selectedRoom.GiaTheoGio || 0) * Number(soGio);
    return Number(selectedRoom.GiaQuaDem || 0); // Qua đêm
  })();

  const tienDichVuRaw = Array.isArray(dichVuList)
    ? dichVuList.reduce((sum, dv) => {
        const qty = serviceQuantities[dv.MaDV] || 0;
        return sum + Number(dv.GiaDV || 0) * qty;
      }, 0)
    : 0;

  const tongTienKinhPhi = tienPhongRaw + tienDichVuRaw;
  const tienDatCoc = tienPhongRaw * 0.5;
  // Cộng/trừ số lượng dịch vụ tại Bước 3
  const handleQuantityChange = (maDV, delta) => {
    setServiceQuantities((prev) => {
      const currentQty = prev[maDV] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [maDV]: newQty };
    });
  };

  // --- VALIDATION LOGIC CHO TỪNG BƯỚC ---
  const handleNext = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!selectedCN) newErrors.selectedCN = "Vui lòng chọn chi nhánh";
      if (!selectedRoom)
        newErrors.selectedRoom = "Vui lòng chọn một số phòng trống cụ thể";
      if (loaiDat === "theo ngày" && soDem <= 0)
        newErrors.dateRange = "Khoảng ngày lưu trú không hợp lệ";
      if (!startDate)
        newErrors.dateRange = "Vui lòng chọn thời gian nhận phòng";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 2) {
      if (!customerInfo.HoTen.trim())
        newErrors.HoTen = "Họ tên không được để trống";
      if (!customerInfo.SDT.trim()) newErrors.SDT = "Số điện thoại bắt buộc";
      if (!customerInfo.Email.trim())
        newErrors.Email = "Email không được để trống";
      if (selectedRoom && customerInfo.SoNguoi > selectedRoom.SoNguoiToiDa) {
        newErrors.SoNguoi = `Phòng này chỉ tối đa ${selectedRoom.SoNguoiToiDa} người`;
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // --- SUBMIT GỬI DỮ LIỆU ĐẶT PHÒNG THẬT LÊN BACKEND ---
  const executeBookingSubmit = async () => {
    try {
      // Gom danh sách dịch vụ đã chọn lớn hơn 0 thành mảng chuẩn payload backend nhận
      const dsDichVuPayload = Object.keys(serviceQuantities)
        .filter((maDV) => serviceQuantities[maDV] > 0)
        .map((maDV) => {
          const serviceInfo = dichVuList.find((dv) => dv.MaDV === maDV);
          return {
            MaDV: maDV,
            SoLuong: serviceQuantities[maDV],
            GiaDV: serviceInfo?.GiaDV || 0,
          };
        });

      const payload = {
        MaCN: selectedCN,

        MaLoai: selectedRoom.MaLoai,

        MaPhong: selectedRoom.MaPhong,

        LoaiDat: loaiDat,

        NgayNhan:
          loaiDat === "theo ngày"
            ? formatDate(startDate)
            : formatDateTime(startDate),

        NgayTra: loaiDat === "theo ngày" ? formatDate(endDate) : "",

        SoGio: loaiDat === "theo giờ" ? soGio : null,

        SoNguoi: customerInfo.SoNguoi,

        HoTen: customerInfo.HoTen,
        SDT: customerInfo.SDT,
        Email: customerInfo.Email,
        GhiChu: customerInfo.GhiChu,

        PhuongThucTT: paymentMethod === "banking" ? "bank" : "cash",

        DichVu: dsDichVuPayload,
      };
      // Gửi request POST lưu hóa đơn đặt phòng lên Backend
      const response = await api.post("/datphong", payload);

      if (response.status === 200 || response.status === 201) {
        const result = response.data?.data || response.data;

        // Lưu toàn bộ dữ liệu booking
        setBookingSuccessData(result);

        // Nếu khách chọn chuyển khoản
        if (result.payment?.type === "bank") {
          setPaymentInfo(result.payment);

          setWaitingPayment(true);

          // KHÔNG chuyển sang Step 5
          return;
        }

        // Nếu khách chọn thanh toán tại quầy
        setCurrentStep(5);
      } else {
        alert("Đặt phòng không thành công. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      console.error("Lỗi hệ thống khi gửi API đặt phòng:", err);
      alert(
        err.response?.data?.message ||
          "Có lỗi xảy ra trong quá trình đặt phòng. Vui lòng thử lại!",
      );
    }
  };

  // --- RENDERING BƯỚC THÀNH CÔNG (STEP 5) ---
  if (currentStep === 5) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon-circle">✓</div>
          <h1>Đặt phòng thành công!</h1>
          <p className="success-sub">
            Mã giữ chỗ và thông tin hóa đơn đã gửi về Email:{" "}
            {customerInfo.Email}
          </p>

          <div className="success-details-box">
            <div className="success-row">
              <span>Mã đặt phòng :</span>
              <strong className="code-text">
                {bookingSuccessData?.booking?.MaDP || "Đợi lễ tân xác nhận"}
              </strong>
            </div>
            <div className="success-row">
              <span>Phòng đã chọn</span>
              <span>Phòng {selectedRoom?.SoPhong}</span>
            </div>
            <div className="success-row">
              <span>Khách hàng đại diện</span>
              <span>{customerInfo.HoTen}</span>
            </div>
            <div className="success-row">
              <span>Nhận phòng</span>
              <span>
                {loaiDat === "theo ngày"
                  ? formatDate(startDate)
                  : formatDateTime(startDate)}
              </span>
            </div>
            {loaiDat === "theo ngày" && (
              <div className="success-row">
                <span>Trả phòng</span>
                <span>{formatDate(endDate)}</span>
              </div>
            )}
            <div className="success-row font-total">
              <span>Tổng chi phí</span>
              <strong>
                {formatVND(bookingSuccessData?.invoice?.ThanhTien)}
              </strong>
            </div>
          </div>

          <div className="success-actions">
            <button className="btn-home" onClick={() => navigate("/")}>
              Quay lại trang chủ
            </button>
            <button className="btn-print" onClick={() => window.print()}>
              In phiếu xác nhận
            </button>
          </div>
        </div>
        <style>{`
          .success-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f7fa; padding: 20px; }
          .success-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 500px; width: 100%; }
          .success-icon-circle { width: 70px; height: 70px; background: #e8f7ee; color: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
          .success-card h1 { font-size: 26px; color: #0f2942; margin-bottom: 8px; font-weight:700; }
          .success-sub { color: #64748b; font-size: 14px; margin-bottom: 25px; }
          .success-details-box { background: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: left; border: 1px solid #edf2f7; }
          .success-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #edf2f7; color: #475569; font-size: 14px; }
          .success-row:last-child { border-bottom: none; }
          .code-text { color: #1d4ed8; font-size: 16px; }
          .font-total { font-weight: bold; color: #0f172a; font-size: 15px; }
          .success-actions { display: flex; gap: 15px; justify-content: center; }
          .btn-home { background: #23486a; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; }
          .btn-print { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="booking-layout-page"
      style={{ backgroundSize: "cover", backgroundAttachment: "fixed" }}
    >
      {/* THANH TIẾN TRÌNH FULL-WIDTH (STEPPER BAR) */}
      <div className="stepper-full-bar">
        <div className={`step-item ${currentStep === 1 ? "active" : ""}`}>
          <span className="step-number">1</span> Chọn phòng
        </div>
        <div className={`step-item ${currentStep === 2 ? "active" : ""}`}>
          <span className="step-number">2</span> Thông tin khách hàng
        </div>
        <div className={`step-item ${currentStep === 3 ? "active" : ""}`}>
          <span className="step-number">3</span> Thêm dịch vụ
        </div>
        <div className={`step-item ${currentStep === 4 ? "active" : ""}`}>
          <span className="step-number">4</span> Xác nhận đặt phòng
        </div>
      </div>

      <div className="booking-main-content">
        {/* BÊN TRÁI: FORM HIỂN THỊ THEO STEP ĐANG ĐỨNG */}
        <div className="left-form-panel">
          {/* STEP 1: CHỌN PHÒNG & THỜI GIAN LƯU TRÚ */}
          {currentStep === 1 && (
            <div className="step-view">
              <h2>Lựa chọn phòng lưu trú</h2>

              <div className="input-block mb-3">
                <label>Chi nhánh đặt khách sạn</label>
                {selectedRoomFromState ? (
                  <input
                    type="text"
                    className="readonly-input"
                    value={
                      chiNhanh?.find((c) => c.MaCN === selectedCN)?.TenCN || ""
                    }
                    readOnly
                  />
                ) : (
                  <select
                    value={selectedCN}
                    onChange={(e) => setSelectedCN(e.target.value)}
                  >
                    <option value="">-- Chọn chi nhánh gần bạn --</option>
                    {chiNhanh.map((cn) => (
                      <option key={cn.MaCN} value={cn.MaCN}>
                        {cn.TenCN}
                      </option>
                    ))}
                  </select>
                )}
                {errors.selectedCN && (
                  <p className="field-error">{errors.selectedCN}</p>
                )}
              </div>

              {isDirectBooking && selectedCN && (
                <div className="input-block mb-3">
                  <label>Hạng loại phòng</label>
                  <select
                    value={selectedLoaiPhong}
                    onChange={(e) => setSelectedLoaiPhong(e.target.value)}
                  >
                    <option value="">-- Chọn phân khúc loại phòng --</option>
                    {loaiPhongList.map((lp) => (
                      <option key={lp.MaLoai} value={lp.MaLoai}>
                        {lp.TenLoai}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label>Hình thức thuê phòng</label>
                <div className="booking-type-row">
                  <label>
                    <input
                      type="radio"
                      name="ldat"
                      checked={loaiDat === "theo ngày"}
                      onChange={() => {
                        setLoaiDat("theo ngày");
                        setDateRange([null, null]);
                      }}
                    />{" "}
                    Theo ngày
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ldat"
                      checked={loaiDat === "theo giờ"}
                      onChange={() => {
                        setLoaiDat("theo giờ");
                        setDateRange([null, null]);
                      }}
                    />{" "}
                    Theo giờ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ldat"
                      checked={loaiDat === "qua đêm"}
                      onChange={() => {
                        setLoaiDat("qua đêm");

                        const d = new Date();
                        d.setHours(22, 0, 0, 0);

                        setDateRange([d, null]);
                      }}
                    />
                    Qua đêm
                  </label>
                </div>
              </div>

              <div className="date-picker-row">
                <div className="input-block">
                  <label>
                    {loaiDat === "theo ngày"
                      ? "Ngày nhận phòng"
                      : "Ngày giờ nhận phòng"}
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      if (!date) return;

                      if (loaiDat === "qua đêm") {
                        const d = new Date(date);

                        d.setHours(22, 0, 0, 0);

                        setDateRange([d, null]);
                      } else if (loaiDat === "theo ngày") {
                        setDateRange([date, endDate]);
                      } else {
                        setDateRange([date, null]);
                      }
                    }}
                    showTimeSelect={loaiDat === "theo giờ"}
                    dateFormat={
                      loaiDat === "theo giờ" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"
                    }
                    minDate={new Date()}
                    placeholderText="Chọn thời gian bắt đầu"
                    className="custom-picker"
                  />
                </div>
                {loaiDat === "theo ngày" && (
                  <div className="input-block">
                    <label>Ngày trả phòng</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setDateRange([startDate, date])}
                      dateFormat="dd/MM/yyyy"
                      minDate={startDate || new Date()}
                      placeholderText="Chọn thời gian trả phòng"
                      className="custom-picker"
                    />
                  </div>
                )}
              </div>
              {errors.dateRange && (
                <p className="field-error mb-3">{errors.dateRange}</p>
              )}

              {loaiDat === "theo giờ" && (
                <div className="input-block mb-3">
                  <label>Số giờ thuê</label>
                  <select
                    value={soGio}
                    onChange={(e) => setSoGio(Number(e.target.value))}
                  >
                    <option value={2}>2 giờ</option>
                    <option value={4}>4 giờ</option>
                    <option value={6}>6 giờ</option>
                  </select>
                </div>
              )}

              {/* HIỂN THỊ DANH SÁCH PHÒNG TRỐNG TỪ API */}
              <div className="room-section-header mt-4">
                <label>
                  Danh sách phòng trống khả dụng ({availableRooms.length})
                </label>
              </div>

              {availableRooms.length > 0 ? (
                <div className="rooms-grid-layout">
                  {availableRooms.map((room) => (
                    <div
                      key={room.MaPhong}
                      className={`room-card-item ${selectedRoom?.MaPhong === room.MaPhong ? "selected" : ""}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="room-mock-img">
                        🏨 Phòng {room.SoPhong}
                      </div>
                      <div className="room-card-body">
                        <h3>Số phòng: {room.SoPhong}</h3>
                        <p className="branch-txt">
                          Tầng: {room.Tang || 1} - Sức chứa:{" "}
                          {room.SoNguoiToiDa || 2} người
                        </p>
                        <p className="price-txt">
                          Giá gốc: <strong>{formatVND(room.GiaPhong)}</strong>
                          /đêm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-rooms-alert">
                  {selectedCN && selectedLoaiPhong
                    ? "Hết phòng trống phù hợp với bộ lọc thời gian hiện tại. Hãy thử đổi ngày nhận/trả phòng khác."
                    : "Vui lòng chọn đầy đủ Chi nhánh, Loại phòng và Ngày tháng để hệ thống quét tìm phòng trống."}
                </div>
              )}
              {errors.selectedRoom && (
                <p className="field-error mt-2">{errors.selectedRoom}</p>
              )}
            </div>
          )}

          {/* STEP 2: THÔNG TIN KHÁCH HÀNG CHÈN LƯU TRÚ */}
          {currentStep === 2 && (
            <div className="step-view">
              <h2>Thông tin người đại diện đặt phòng</h2>
              <div className="form-double-col">
                <div className="input-block">
                  <label>Họ và tên khách hàng *</label>
                  <input
                    type="text"
                    placeholder="Nhập đầy đủ tên có dấu"
                    value={customerInfo.HoTen}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        HoTen: e.target.value,
                      })
                    }
                  />
                  {errors.HoTen && (
                    <p className="field-error">{errors.HoTen}</p>
                  )}
                </div>
                <div className="input-block">
                  <label>Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    placeholder="Nhập số di động"
                    value={customerInfo.SDT}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, SDT: e.target.value })
                    }
                  />
                  {errors.SDT && <p className="field-error">{errors.SDT}</p>}
                </div>
              </div>

              <div className="input-block mt-3">
                <label>Địa chỉ email (Nhận hóa đơn điện tử) *</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={customerInfo.Email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, Email: e.target.value })
                  }
                />
                {errors.Email && <p className="field-error">{errors.Email}</p>}
              </div>

              <div className="input-block mt-3">
                <label>Số lượng khách lưu trú thực tế *</label>

                <input
                  type="number"
                  min={1}
                  max={selectedRoom?.SoNguoiToiDa || 1}
                  value={customerInfo.SoNguoi}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setCustomerInfo({
                      ...customerInfo,
                      SoNguoi: Math.min(
                        Math.max(value, 1),
                        selectedRoom?.SoNguoiToiDa || 1,
                      ),
                    });

                    setErrors({
                      ...errors,
                      SoNguoi: "",
                    });
                  }}
                />

                {selectedRoom && (
                  <small
                    style={{
                      color: "#64748b",
                      marginTop: 6,
                      display: "block",
                    }}
                  >
                    Sức chứa tối đa: <b>{selectedRoom.SoNguoiToiDa}</b> người
                  </small>
                )}

                {errors.SoNguoi && (
                  <p className="field-error">{errors.SoNguoi}</p>
                )}
              </div>

              <div className="input-block mt-3">
                <label>Ghi chú đặc biệt cho lễ tân khách sạn</label>
                <textarea
                  placeholder="Ví dụ: Phòng không hút thuốc, Check-in muộn sau 20h..."
                  value={customerInfo.GhiChu}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, GhiChu: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3: THÊM DỊCH VỤ ĐI KÈM */}
          {currentStep === 3 && (
            <div className="step-view">
              <h2>Dịch vụ bổ sung đi kèm</h2>
              <p className="subtitle-desc">
                Tích chọn thêm dịch vụ tiện ích để có kỳ nghỉ trọn vẹn nhất
              </p>

              {Array.isArray(dichVuList) && dichVuList.length > 0 ? (
                <div className="services-list-vertical">
                  {dichVuList.map((dv) => {
                    const currentQty = serviceQuantities[dv.MaDV] || 0;
                    return (
                      <div
                        key={dv.MaDV}
                        className={`service-row-item ${currentQty > 0 ? "has-qty" : ""}`}
                      >
                        <div className="service-leading-box">
                          <div className="mock-square-icon">🛎️</div>
                          <div className="service-text">
                            <h4>{dv.TenDV}</h4>
                            <p>
                              {formatVND(dv.GiaDV)}{" "}
                              <span
                                style={{
                                  color: "#64748b",
                                  fontWeight: "normal",
                                }}
                              >
                                / {dv.DonVi || "lượt"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="counter-action-buttons">
                          <button
                            onClick={() => handleQuantityChange(dv.MaDV, -1)}
                          >
                            -
                          </button>
                          <span className="qty-value">{currentQty}</span>
                          <button
                            onClick={() => handleQuantityChange(dv.MaDV, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-rooms-alert">
                  Chi nhánh này hiện tại không phân phối dịch vụ trực tuyến
                  thêm. Ấn Tiếp tục bước tiếp theo.
                </div>
              )}
            </div>
          )}

          {/* STEP 4: XÁC NHẬN & CHỌN CỔNG THANH TOÁN */}
          {currentStep === 4 && (
            <div className="step-view">
              <h2>Xác nhận thông tin thanh toán</h2>

              <div className="invoice-summary-table-box">
                <table className="info-table-spec">
                  <tbody>
                    <tr>
                      <td>Số hiệu phòng:</td>
                      <td>Phòng {selectedRoom?.SoPhong}</td>
                    </tr>
                    <tr>
                      <td>Hình thức thuê:</td>
                      <td style={{ textTransform: "capitalize" }}>{loaiDat}</td>
                    </tr>
                    <tr>
                      <td>Tên khách hàng:</td>
                      <td>{customerInfo.HoTen}</td>
                    </tr>
                    <tr>
                      <td>Số điện thoại:</td>
                      <td>{customerInfo.SDT}</td>
                    </tr>
                    <tr>
                      <td>Email liên hệ:</td>
                      <td>{customerInfo.Email}</td>
                    </tr>
                    <tr>
                      <td>Thời gian Check-In:</td>
                      <td>
                        {loaiDat === "theo ngày"
                          ? formatDate(startDate)
                          : formatDateTime(startDate)}
                      </td>
                    </tr>
                    {loaiDat === "theo ngày" && (
                      <tr>
                        <td>Thời gian Check-Out:</td>
                        <td>
                          {formatDate(endDate)} ({soDem} đêm)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="payment-method-selection mt-4">
                <h3>Lựa chọn cổng/hình thức thanh toán</h3>
                <label className="radio-method-container">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "banking"}
                    onChange={() => setPaymentMethod("banking")}
                  />
                  <div className="radio-custom-label">
                    Chuyển khoản Ngân hàng nội địa (QR Code nhanh)
                  </div>
                </label>
                <label className="radio-method-container">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "hotel"}
                    onChange={() => setPaymentMethod("hotel")}
                  />
                  <div className="radio-custom-label">
                    Thanh toán tiền mặt/quẹt thẻ trực tiếp tại quầy lễ tân
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ACTION NAVIGATION BUTTONS */}
          <div className="bottom-panel-actions">
            {currentStep > 1 && !waitingPayment && (
              <button className="btn-back-flow" onClick={handleBack}>
                Quay lại
              </button>
            )}

            {currentStep < 4 ? (
              <button className="btn-next-flow" onClick={handleNext}>
                Tiếp tục đặt phòng
              </button>
            ) : (
              !waitingPayment && (
                <button
                  className="btn-next-flow btn-confirm-pay"
                  onClick={executeBookingSubmit}
                >
                  Tạo đặt phòng • cọc tạm tính {formatVND(tienDatCoc)}
                </button>
              )
            )}
          </div>
          {waitingPayment && paymentInfo?.type === "bank" && (
            <div className="vietqr-box">
              <h3>Quét mã QR để thanh toán</h3>

              <img
                src={paymentInfo.qrUrl}
                alt="vietqr"
                className="vietqr-image"
              />

              <div className="vietqr-info">
                <p>
                  <strong>Ngân hàng</strong>

                  <span>{paymentInfo.bankName}</span>
                </p>

                <p>
                  <strong>Số tài khoản</strong>

                  <span>{paymentInfo.accountNumber}</span>
                </p>

                <p>
                  <strong>Chủ tài khoản</strong>

                  <span>{paymentInfo.accountName}</span>
                </p>

                <p>
                  <strong>Nội dung CK</strong>

                  <span>{paymentInfo.content}</span>
                </p>

                <p>
                  <strong>Số tiền</strong>

                  <span>{formatVND(paymentInfo.amount)}</span>
                </p>
              </div>

              <button
                className="btn-paid"
                onClick={() => {
                  setWaitingPayment(false);
                  setCurrentStep(5);
                }}
              >
                Tôi đã thanh toán
              </button>
            </div>
          )}
        </div>

        {/* BÊN PHẢI: KHU VỰC TÓM TẮT ĐẶT PHÒNG CỐ ĐỊNH (REAL-TIME SUMMARY) */}
        <div className="right-summary-panel">
          <div className="summary-sticky-card">
            <h3>Tạm tính đặt phòng</h3>

            <div className="room-mini-preview-card">
              <div className="img-placeholder-mini">
                🛏️{" "}
                {selectedRoom
                  ? `Phòng ${selectedRoom.SoPhong}`
                  : "Chưa chọn phòng"}
              </div>
              <h4>Hạng phòng: {selectedRoom ? selectedRoom.SoPhong : "---"}</h4>
              <p className="sub-txt">
                Cơ sở:{" "}
                {chiNhanh.find((c) => c.MaCN === selectedCN)?.TenCN ||
                  "Chưa chọn cơ sở"}
              </p>
            </div>

            <div className="pricing-breakdown-area">
              <div className="price-row">
                <span>Tiền phòng gốc:</span>
                <strong>{formatVND(tienPhongRaw)}</strong>
              </div>
              <div className="summary-row">
                <span>Đặt cọc (50%):</span>
                <span className="deposit">{formatVND(tienDatCoc)}</span>
              </div>
              <div className="summary-total">
                <span>Thanh toán hôm nay:</span>
                <span>{formatVND(tienDatCoc)}</span>
              </div>

              {/* Chỉ kết xuất dịch vụ có số lượng khách thêm lớn hơn 0 */}
              {Array.isArray(dichVuList) &&
                dichVuList.map((dv) => {
                  const qty = serviceQuantities[dv.MaDV] || 0;
                  if (qty <= 0) return null;
                  return (
                    <div className="price-row extra-dv-row" key={dv.MaDV}>
                      <span>
                        • {dv.TenDV} (x{qty})
                      </span>
                      <span>{formatVND(dv.GiaDV * qty)}</span>
                    </div>
                  );
                })}

              <hr className="divider-line" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .booking-layout-page { max-width: 1200px; margin: 0 auto; padding: 40px 20px; min-height: 100vh; }
        .stepper-full-bar { display: flex; background: #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 30px; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
        .step-item { flex: 1; padding: 18px; text-align: center; color: #475569; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; background:#fff; border-right: 1px solid #e2e8f0; }
        .step-item.active { background: #23486a; color: white; }
        .step-number { width: 24px; height: 24px; border-radius: 50%; background: #edf2f7; color: #475569; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
        .step-item.active .step-number { background: white; color: #23486a; }
        .booking-main-content { display: grid; grid-template-columns: 1fr 380px; gap: 30px; align-items: start; }
        .left-form-panel { background: rgba(255,255,255,0.96); padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); min-height: 580px; display: flex; flex-direction: column; justify-content: space-between; }
        .step-view h2 { font-size: 22px; color: #0f172a; margin-bottom: 24px; font-weight: 700; }
        .date-picker-row { display: flex; gap: 20px; margin-bottom: 15px; }
        .input-block { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .input-block label { font-size: 14px; font-weight: 600; color: #334155; }
        .readonly-input { background: #f1f5f9 !important; font-weight: 600; color: #1e3a8a; }
        .custom-picker, .input-block input, .input-block select, .input-block textarea { padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; outline: none; width: 100%; box-sizing: border-box; background:#fff; }
        .input-block textarea { height: 100px; resize: none; }
        .form-double-col { display: flex; gap: 20px; }
        .booking-type-row { display: flex; gap: 20px; background: #fff; padding: 10px 15px; border: 1px solid #cbd5e1; border-radius: 12px; }
        .booking-type-row label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin: 0; }
        .rooms-grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-height: 300px; overflow-y: auto; padding-right: 4px; }
        .room-card-item { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s; background: white; }
        .room-card-item.selected { border-color: #3b82f6; background: #f0fdf4; box-shadow: 0 0 0 1px #3b82f6; }
        .room-mock-img { height: 100px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #475569; font-weight: 600; font-size: 14px; }
        .room-card-body { padding: 12px; }
        .room-card-body h3 { font-size: 15px; margin: 0 0 4px; color: #0f172a; }
        .branch-txt { font-size: 12px; color: #64748b; margin: 0 0 6px; }
        .price-txt { margin: 0; font-size: 13px; color: #334155; }
        .empty-rooms-alert { padding: 20px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; text-align: center; color: #64748b; font-size: 14px; }
        .services-list-vertical { display: flex; flex-direction: column; gap: 12px; }
        .service-row-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border: 1px solid #e2e8f0; border-radius: 14px; background:#fff; }
        .service-row-item.has-qty { border-color: #3b82f6; background: #f8fafc; }
        .service-leading-box { display: flex; gap: 15px; align-items: center; }
        .mock-square-icon { width: 40px; height: 40px; background: #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .service-text h4 { margin: 0 0 2px; font-size: 14px; color: #0f172a; font-weight: 600; }
        .service-text p { margin: 0; font-size: 13px; color: #2563eb; font-weight: 600; }
        .counter-action-buttons { display: flex; align-items: center; gap: 12px; }
        .counter-action-buttons button { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: bold; font-size: 14px; }
        .qty-value { font-weight: 700; font-size: 14px; min-width: 15px; text-align: center; }
        .invoice-summary-table-box { background: #f8fafc; border-radius: 14px; padding: 16px; border: 1px solid #e2e8f0; }
        .info-table-spec { width: 100%; border-collapse: collapse; }
        .info-table-spec td { padding: 8px 0; font-size: 14px; color: #475569; }
        .info-table-spec td:last-child { text-align: right; font-weight: 600; color: #0f172a; }
        .radio-method-container { display: flex; align-items: center; gap: 10px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 12px; cursor: pointer; background:#fff; }
        .radio-method-container input { width: auto; }
        .radio-custom-label { font-size: 14px; font-weight: 500; color: #1e293b; }
        .bottom-panel-actions { display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .btn-back-flow { background: #fff; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 10px; font-weight: 600; color: #475569; cursor: pointer; }
        .btn-next-flow { background: #23486a; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; flex-grow: 1; text-align: center; }
        .btn-confirm-pay { background: #1e3a8a; }
        .field-error { color: #dc2626; font-size: 13px; margin-top: 4px; font-weight: 500; }
        .right-summary-panel { position: sticky; top: 30px; }
        .summary-sticky-card { background: rgba(255,255,255,0.96); border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .summary-sticky-card h3 { font-size: 16px; margin: 0 0 16px; color: #0f172a; font-weight: 700; }
        .room-mini-preview-card { border-bottom: 1px solid #edf2f7; padding-bottom: 16px; margin-bottom: 16px; }
        .img-placeholder-mini { height: 100px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 13px; margin-bottom: 10px; font-weight: 500; }
        .room-mini-preview-card h4 { margin: 0 0 4px; font-size: 15px; color: #0f172a; font-weight: 700; }
        .sub-txt { margin: 0; font-size: 12px; color: #64748b; }
        .pricing-breakdown-area { display: flex; flex-direction: column; gap: 10px; }
        .price-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
        .extra-dv-row { font-size: 13px; color: #64748b; padding-left: 8px; }
        .divider-line { border: none; border-top: 1px solid #edf2f7; margin: 8px 0; }
        .total-row-summary { font-size: 15px; color: #0f172a; font-weight: bold; align-items: center; }
        .grand-price { font-size: 18px; color: #1e3a8a; }
        .mb-3 { margin-bottom: 16px; }
        .mt-4 { margin-top: 24px; }

        .vietqr-box{

          margin-top:30px;

          padding:25px;

          border-radius:16px;

          background:white;

          border:2px solid #23486a;

          text-align:center;

          }

          .vietqr-image{

          width:260px;

          margin:20px auto;

          display:block;

          }

          .vietqr-info{

          margin-top:20px;

          }

          .vietqr-info p{

          display:flex;

          justify-content:space-between;

          padding:10px 0;

          border-bottom:1px solid #eee;

          }

          .btn-paid{

          margin-top:25px;

          background:#16a34a;

          color:white;

          border:none;

          padding:14px 30px;

          border-radius:10px;

          font-weight:bold;

          cursor:pointer;

          font-size:15px;

          }

        @media (max-width: 992px) { .booking-main-content { grid-template-columns: 1fr; } .right-summary-panel { position: static; } }
      `}</style>
    </div>
  );
}

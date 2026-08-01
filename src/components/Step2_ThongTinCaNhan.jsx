import DatePicker from "react-datepicker";
import { useEffect } from "react";
import api from "../../services/api";

export default function Step2_ThongTinCaNhan({
  form,
  setForm,
  errors,
  setErrors,
  startDate,
  endDate,
  setDateRange,
  currentLoaiPhong,
}) {
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/khachhang/profile");

      const kh = res.data;

      setForm((prev) => ({
        ...prev,
        HoTenKH: kh.HoTenKH || "",
        SDT: kh.SDT || "",
        Email: kh.Email || "",
        CCCD: kh.CCCD || "",
        DiaChi: kh.DiaChi || "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h3 style={{ marginBottom: 20 }}>Bước 2: Cung cấp thông tin lưu trú</h3>

      {/* ================= THÔNG TIN KHÁCH HÀNG ================= */}

      <div className="form-group" style={{ marginBottom: 15 }}>
        <label>Họ và tên</label>

        <input type="text" value={form.HoTenKH || ""} readOnly />
      </div>

      <div className="form-group" style={{ marginBottom: 15 }}>
        <label>Số điện thoại</label>

        <input type="text" value={form.SDT || ""} readOnly />
      </div>

      <div className="form-group" style={{ marginBottom: 15 }}>
        <label>Email</label>

        <input type="email" value={form.Email || ""} readOnly />
      </div>

      <div className="form-group" style={{ marginBottom: 15 }}>
        <label>CCCD</label>

        <input type="text" value={form.CCCD || ""} readOnly />
      </div>

      <div className="form-group" style={{ marginBottom: 20 }}>
        <label>Địa chỉ</label>

        <input
          type="text"
          value={form.DiaChi || ""}
          onChange={(e) =>
            setForm({
              ...form,
              DiaChi: e.target.value,
            })
          }
        />
      </div>

      {/* ================= HÌNH THỨC THUÊ ================= */}

      <div className="form-group" style={{ marginBottom: 15 }}>
        <label>Hình thức thuê</label>

        <div className="booking-type">
          <label>
            <input
              type="radio"
              checked={form.LoaiDat === "theo ngày"}
              onChange={() =>
                setForm({
                  ...form,
                  LoaiDat: "theo ngày",
                })
              }
            />
            Theo ngày
          </label>

          <label>
            <input
              type="radio"
              checked={form.LoaiDat === "theo giờ"}
              onChange={() =>
                setForm({
                  ...form,
                  LoaiDat: "theo giờ",
                })
              }
            />
            Theo giờ
          </label>

          <label>
            <input
              type="radio"
              checked={form.LoaiDat === "qua đêm"}
              onChange={() =>
                setForm({
                  ...form,
                  LoaiDat: "qua đêm",
                })
              }
            />
            Qua đêm
          </label>
        </div>
      </div>

      {/* ================= THỜI GIAN ================= */}

      <div style={{ marginBottom: 15 }}>
        <label>Chọn thời gian</label>

        {form.LoaiDat === "theo ngày" && (
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              setErrors({
                ...errors,
                DateRange: "",
              });
            }}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Ngày nhận phòng - Ngày trả phòng"
            className="booking-date-input"
          />
        )}

        {form.LoaiDat === "theo giờ" && (
          <>
            <DatePicker
              selected={startDate}
              onChange={(date) => setDateRange([date, null])}
              showTimeSelect
              timeIntervals={30}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="Chọn ngày giờ nhận"
              className="booking-date-input"
            />

            <select
              value={form.SoGio}
              onChange={(e) =>
                setForm({
                  ...form,
                  SoGio: Number(e.target.value),
                })
              }
              style={{
                marginTop: 10,
                height: 45,
                width: "100%",
                borderRadius: 10,
                padding: "0 10px",
              }}
            >
              <option value={2}>2 giờ</option>
              <option value={4}>4 giờ</option>
              <option value={6}>6 giờ</option>
              <option value={12}>12 giờ</option>
            </select>
          </>
        )}

        {form.LoaiDat === "qua đêm" && (
          <DatePicker
            selected={startDate}
            onChange={(date) => setDateRange([date, null])}
            showTimeSelect
            timeIntervals={30}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Ngày giờ nhận"
            className="booking-date-input"
          />
        )}

        {errors.DateRange && <p className="field-error">{errors.DateRange}</p>}
      </div>

      {/* ================= SỐ NGƯỜI ================= */}

      <div style={{ marginBottom: 15 }}>
        <label>Số lượng khách lưu trú</label>

        <input
          type="number"
          min={1}
          max={currentLoaiPhong?.SoNguoiToiDa || 10}
          value={form.SoNguoi}
          onChange={(e) => {
            const value = Number(e.target.value);

            setForm({
              ...form,
              SoNguoi: value,
            });

            if (currentLoaiPhong && value > currentLoaiPhong.SoNguoiToiDa) {
              setErrors({
                ...errors,
                SoNguoi: `Phòng chỉ cho tối đa ${currentLoaiPhong.SoNguoiToiDa} người`,
              });
            } else {
              setErrors({
                ...errors,
                SoNguoi: "",
              });
            }
          }}
        />

        {errors.SoNguoi && <p className="field-error">{errors.SoNguoi}</p>}

        {currentLoaiPhong?.SoNguoiToiDa && (
          <small style={{ color: "#64748b" }}>
            * Tối đa cho phép: {currentLoaiPhong.SoNguoiToiDa} người
          </small>
        )}
      </div>
    </>
  );
}

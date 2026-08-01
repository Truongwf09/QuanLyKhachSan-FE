import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import banner from "../../assets/banner.jpeg";
import Select from "react-select";

export default function Register() {
  const navigate = useNavigate();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    HoTenKH: "",
    GioiTinh: "Nam",
    NgSinh: "",
    SDT: "",
    Email: "",
    CCCD: "",
    DiaChi: "",
    MatKhau: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    // Họ tên
    if (!form.HoTenKH.trim()) {
      newErrors.HoTenKH = "Vui lòng nhập họ tên";
    } else if (form.HoTenKH.trim().length < 2) {
      newErrors.HoTenKH = "Họ tên tối thiểu 2 ký tự";
    }

    // Ngày sinh
    if (!form.NgSinh) {
      newErrors.NgSinh = "Vui lòng chọn ngày sinh";
    } else {
      const today = new Date();
      const birth = new Date(form.NgSinh);

      let age = today.getFullYear() - birth.getFullYear();

      const m = today.getMonth() - birth.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.NgSinh = "Khách hàng phải từ 18 tuổi";
      }
    }

    // SDT
    if (!form.SDT.trim()) {
      newErrors.SDT = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(form.SDT)) {
      newErrors.SDT = "Số điện thoại gồm 10 số";
    }

    // Email
    if (!form.Email.trim()) {
      newErrors.Email = "Vui lòng nhập Email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.Email)) {
      newErrors.Email = "Email không hợp lệ";
    }

    // CCCD
    if (!form.CCCD.trim()) {
      newErrors.CCCD = "Vui lòng nhập CCCD";
    } else if (!/^\d{12}$/.test(form.CCCD)) {
      newErrors.CCCD = "CCCD phải gồm đúng 12 số";
    }

    // Địa chỉ
    if (!form.DiaChi.trim()) {
      newErrors.DiaChi = "Vui lòng nhập địa chỉ";
    }

    // Mật khẩu
    if (!form.MatKhau) {
      newErrors.MatKhau = "Vui lòng nhập mật khẩu";
    } else if (form.MatKhau.length < 6) {
      newErrors.MatKhau = "Mật khẩu tối thiểu 6 ký tự";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(form.MatKhau)) {
      newErrors.MatKhau = "Mật khẩu phải có chữ hoa, chữ thường và số";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await API.post("/khachhang/register", form);

      setPendingEmail(form.Email);
      setShowOTPModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Nhập mã OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/khachhang/verify-otp", {
        Email: pendingEmail,
        OTPCode: otp,
      });

      alert(res.data.message || "Đăng ký thành công");

      setShowOTPModal(false);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };
  const handleResendOTP = async () => {
    try {
      await API.post("/khachhang/resend-otp", {
        Email: pendingEmail,
      });

      alert("Đã gửi lại OTP");
    } catch (err) {
      alert("Không thể gửi lại OTP");
    }
  };

  return (
    <>
      <div className="register-page">
        <div className="register-card">
          {/* LEFT */}
          <div className="register-left">
            <img src={banner} alt="hotel" />
            <div className="overlay"></div>

            <div className="welcome-content">
              <h1>CÙNG TEALHAVEN</h1>
              <p>Khởi tạo tài khoản, mở khóa trải nghiệm đẳng cấp.</p>

              <button onClick={() => navigate("/")}>← Về trang chủ</button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="register-right">
            <div className="form-box">
              <h2>Đăng ký</h2>
              <p className="subtitle">
                Tạo tài khoản khách hàng TealHaven Hotel
              </p>

              <div className="form-grid">
                <input
                  name="HoTenKH"
                  placeholder="Họ tên"
                  onChange={handleChange}
                />
                {errors.HoTenKH && (
                  <p className="error-text">{errors.HoTenKH}</p>
                )}

                <Select
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                  defaultValue={{ value: "Nam", label: "Nam" }}
                  onChange={(option) =>
                    setForm({
                      ...form,
                      GioiTinh: option.value,
                    })
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      border: state.isFocused
                        ? "1px solid #2f80ed"
                        : "1px solid #dce7f5",
                      boxShadow: state.isFocused
                        ? "0 0 0 3px rgba(47,128,237,0.12)"
                        : "none",
                      fontSize: "15px",
                      paddingLeft: "4px",
                      backgroundColor: "#fff",
                      "&:hover": {
                        border: "1px solid #2f80ed",
                      },
                    }),

                    valueContainer: (base) => ({
                      ...base,
                      height: "56px",
                      padding: "0 12px",
                    }),

                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),

                    indicatorSeparator: () => ({
                      display: "none",
                    }),

                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "#94a3b8",
                      paddingRight: "14px",
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
                  }}
                />

                <input type="date" name="NgSinh" onChange={handleChange} />
                {errors.NgSinh && <p className="error-text">{errors.NgSinh}</p>}

                <input
                  name="SDT"
                  placeholder="Số điện thoại"
                  onChange={handleChange}
                />
                {errors.SDT && <p className="error-text">{errors.SDT}</p>}

                <input
                  name="Email"
                  placeholder="Email"
                  onChange={handleChange}
                />
                {errors.Email && <p className="error-text">{errors.Email}</p>}

                <input name="CCCD" placeholder="CCCD" onChange={handleChange} />
                {errors.CCCD && <p className="error-text">{errors.CCCD}</p>}

                <input
                  name="DiaChi"
                  placeholder="Địa chỉ"
                  onChange={handleChange}
                />
                {errors.DiaChi && <p className="error-text">{errors.DiaChi}</p>}

                <input
                  type="password"
                  name="MatKhau"
                  placeholder="Mật khẩu"
                  onChange={handleChange}
                />
                {errors.MatKhau && (
                  <p className="error-text">{errors.MatKhau}</p>
                )}
              </div>

              {showOTPModal && (
                <div className="otp-inline-box">
                  <div className="otp-header">
                    <div>
                      <h4>Xác thực email</h4>
                      <p>
                        Mã OTP đã được gửi đến
                        <strong> {pendingEmail}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="otp-actions">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      placeholder="Nhập mã OTP"
                      onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                      type="button"
                      className="otp-confirm-btn"
                      onClick={handleVerifyOTP}
                    >
                      Xác nhận
                    </button>
                  </div>

                  <button
                    type="button"
                    className="otp-resend-btn"
                    onClick={handleResendOTP}
                  >
                    Gửi lại mã OTP
                  </button>
                </div>
              )}

              <button
                className="register-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <p className="switch">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, sans-serif;
          background: linear-gradient(135deg, #eef6ff, #dfeeff);
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
        }

        .register-card {
          width: 1250px;
          max-width: 100%;
          min-height: 760px;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          box-shadow: 0 30px 80px rgba(15, 76, 129, 0.18);
        }

        .register-left {
          position: relative;
          overflow: hidden;
        }

        .register-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(8, 32, 64, 0.72),
            rgba(15, 76, 129, 0.28)
          );
        }

        .welcome-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          padding: 40px;
        }

        .welcome-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 50px;
          letter-spacing: 6px;
          margin: 0;
        }

        .welcome-content p {
          font-size: 18px;
          margin: 16px 0 28px;
        }

        .welcome-content button {
          border: none;
          padding: 14px 26px;
          border-radius: 30px;
          background: white;
          color: #0f4c81;
          font-weight: 600;
          cursor: pointer;
        }

        .register-right {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px;
        }

        .form-box {
          width: 100%;
          max-width: 520px;
        }

        .form-box h2 {
          font-size: 42px;
          margin: 0;
          color: #0d1b2a;
        }

        .subtitle {
          color: #6b7a90;
          margin: 12px 0 28px;
        }

        .form-grid{
          display:grid;
            grid-template-columns:repeat(2,1fr);
             gap:18px 20px;
          }
           .form-item{
           display:flex;
            flex-direction:column;
            min-height:92px;
            }
        .error-text{
    margin-top:6px;
    margin-left:2px;

    color:#ef4444;

    font-size:13px;

    font-weight:500;

    line-height:18px;

    min-height:18px;
}
    .form-item input:focus{
    border-color:#2f80ed;
    box-shadow:0 0 0 3px rgba(47,128,237,.15);
}
    .form-item input,
.form-item .css-b62m3t-container{
    height:56px;
}
    .form-item input[type="date"]{
    cursor:pointer;
}
        .form-grid input,
        .form-grid select {
          width: 100%;
          border: 1px solid #dce7f5;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        .form-grid input:focus,
        .form-grid select:focus {
          border-color: #2f80ed;
          box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.12);
        }

        .register-btn {
          width: 100%;
          margin-top: 24px;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #2f80ed, #0f4c81);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .switch {
          text-align: center;
          margin-top: 20px;
          color: #6b7a90;
        }

        .switch a {
          color: #2f80ed;
          text-decoration: none;
          font-weight: 600;
        }

        // OTP Modal Styles
          .otp-inline-box {
            margin: 18px 0 10px;
            padding: 22px;
            border-radius: 22px;
            background: linear-gradient(
              135deg,
              rgba(244, 249, 255, 0.98),
              rgba(255, 255, 255, 0.98)
            );
            border: 1px solid #dce7f5;
            box-shadow: 0 12px 30px rgba(15, 76, 129, 0.08);
          }

          .otp-header {
            display: flex;
            gap: 14px;
            align-items: center;
            margin-bottom: 16px;
          }

          .otp-header h4 {
            margin: 20px 0 0;
            font-size: 20px;
            font-weight: 700;
            color: #0d1b2a;
          }

          .otp-header p {
            margin: 6px 0 0;
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
          }

          .otp-header strong {
            color: #0f4c81;
            font-weight: 700;
          }

          .otp-actions {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .otp-actions input {
            flex: 1;
            height: 50px;
            border-radius: 16px;
            border: 1px solid #dce7f5;
            background: white;
            padding: 0 18px;
            font-size: 18px;
            text-align: center;
            letter-spacing: 6px;
            outline: none;
            transition: all 0.3s ease;
          }

          .otp-actions input:focus {
            border-color: #4a90ff;
            box-shadow: 0 0 0 4px rgba(74, 144, 255, 0.12);
          }

          .otp-confirm-btn {
            height: 50px;
            padding: 0 24px;
            border: none;
            border-radius: 16px;
            background: #D8E1F0;
            color: #0f4c81;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: 0.3s;
          }

          .otp-confirm-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(47, 128, 237, 0.2);
          }

          .otp-resend-btn {
            margin-top: 14px;
            background: none;
            border: none;
            color: #0f4c81;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
            font-size: 14px;
          }

          .otp-resend-btn:hover {
            color: #0f4c81;
          }

        @media (max-width: 1000px) {
          .register-card {
            grid-template-columns: 1fr;
          }

          .register-left {
            min-height: 280px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

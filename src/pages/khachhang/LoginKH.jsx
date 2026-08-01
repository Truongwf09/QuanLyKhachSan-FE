// import { useState } from "react";
// import API from "../../services/api";
// import { useNavigate, Link } from "react-router-dom";

// export default function LoginKH() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     Email: "",
//     MatKhau: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     if (!form.Email || !form.MatKhau) {
//       alert("Nhập đầy đủ thông tin");
//       return;
//     }

//     try {
//       setLoading(true);
//       localStorage.clear();

//       const res = await API.post("/khachhang/login", form);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       alert("Đăng nhập thành công");

//       // 👉 QUAN TRỌNG: quay về Home
//       navigate("/");

//     } catch (err) {
//       alert(err.response?.data?.message || "Sai thông tin");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper">

//       {/* LEFT SIDE */}
//       <div className="left">
//         <h1>TealHaven Hotel</h1>
//         <p>Chào mừng bạn quay lại 👋</p>

//         <button onClick={() => navigate("/")}>
//           ← Về trang chủ
//         </button>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="login-container">
//         <h2>Đăng nhập</h2>

//         <input
//           name="Email"
//           placeholder="Email"
//           value={form.Email}
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="MatKhau"
//           placeholder="Mật khẩu"
//           value={form.MatKhau}
//           onChange={handleChange}
//         />

//         <button onClick={handleLogin} disabled={loading}>
//           {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//         </button>

//         <p className="switch">
//           Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
//         </p>
//       </div>

//       {/* CSS */}
//       <style>{`
//         .login-wrapper {
//           display: flex;
//           height: 100vh;
//         }

//         .left {
//           flex: 1;
//           background: linear-gradient(135deg, #4a6cf7, #6f8cff);
//           color: white;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }

//         .left h1 {
//           margin-bottom: 10px;
//         }

//         .left button {
//           margin-top: 20px;
//           padding: 10px 20px;
//           border: none;
//           border-radius: 20px;
//           background: white;
//           color: #4a6cf7;
//           cursor: pointer;
//         }

//         .login-container {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           padding: 40px;
//           gap: 15px;
//         }

//         .login-container input {
//           padding: 12px;
//           border-radius: 10px;
//           border: 1px solid #ddd;
//           outline: none;
//         }

//         .login-container button {
//           padding: 12px;
//           border-radius: 10px;
//           border: none;
//           background: #4a6cf7;
//           color: white;
//           cursor: pointer;
//         }

//         .switch {
//           text-align: center;
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import banner from "../../assets/banner.jpeg";
import "../../styles/login_kh.css";

export default function LoginKH() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Email: "",
    MatKhau: "",
  });

  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!form.Email || !form.MatKhau) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      console.log("ĐÂY LÀ FILE LOGINKH MỚI");
      console.log(API.defaults.baseURL);

      const res = await API.post("/khachhang/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const redirectTo = location.state?.redirectTo;
      const room = location.state?.room;

      if (redirectTo) {
        navigate(redirectTo, {
          state: { room },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Sai thông tin đăng nhập");
    } finally {
      setLoading(false);
    }
  };
  const handleSendOTP = async () => {
    try {
      await API.post("/khachhang/forgot-password", {
        Email: forgotEmail,
      });

      alert("OTP đã được gửi về email");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gửi OTP thất bại");
    }
  };

  const handleResetPassword = async () => {
    try {
      await API.post("/khachhang/reset-password", {
        Email: forgotEmail,
        OTPCode: otpCode,
        newPassword,
        confirmPassword,
      });

      alert("Đổi mật khẩu thành công");

      setShowForgot(false);
      setOtpSent(false);

      setForgotEmail("");
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <>
      <div className="login-page-kh">
        <div className="login-card-kh">
          <div className="login-left-kh">
            <img src={banner} alt="hotel" />
            <div className="overlay-kh"></div>

            <div className="welcome-content-kh">
              <h1>CHÀO MỪNG</h1>
              <p>Nghỉ dưỡng đẳng cấp bắt đầu từ đây.</p>

              <button onClick={() => navigate("/")}>← Về trang chủ</button>
            </div>
          </div>

          <div className="login-right-kh">
            <div className="form-box-kh">
              <h2>Đăng nhập</h2>
              <p className="subtitle-kh">
                Chào mừng bạn quay lại TealHaven Hotel
              </p>

              <input
                name="Email"
                placeholder="Email"
                value={form.Email}
                onChange={handleChange}
              />

              <input
                type="password"
                name="MatKhau"
                placeholder="Mật khẩu"
                value={form.MatKhau}
                onChange={handleChange}
              />
              <p
                style={{
                  textAlign: "right",
                  marginTop: "-8px",
                  marginBottom: "15px",
                  color: "#0d6efd",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setShowForgot(true)}
              >
                Quên mật khẩu?
              </p>
              <button
                className="login-btn-kh"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <p className="switch-kh">
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
            </div>
          </div>
          {showForgot && (
            <div className="forgot-overlay">
              <div className="forgot-modal">
                <h3>Quên mật khẩu</h3>

                <input
                  type="email"
                  placeholder="Nhập email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />

                {!otpSent ? (
                  <button className="login-btn-kh" onClick={handleSendOTP}>
                    Gửi OTP
                  </button>
                ) : (
                  <>
                    <input
                      placeholder="Nhập OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="Mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                      className="login-btn-kh"
                      onClick={handleResetPassword}
                    >
                      Đổi mật khẩu
                    </button>
                  </>
                )}

                <button
                  className="close-btn"
                  onClick={() => {
                    setShowForgot(false);
                    setOtpSent(false);

                    setForgotEmail("");
                    setOtpCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

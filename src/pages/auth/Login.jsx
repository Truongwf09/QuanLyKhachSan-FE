import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/login_admin.css";
import loginBg from "../../assets/login_bg_admin.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      localStorage.clear();

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = {
        ...res.data.user,
        role: res.data.role,
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "permissions",
        JSON.stringify(res.data.permissions || []),
      );

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "quanly") navigate("/quanly");
      else if (user.role === "tiep_tan") navigate("/tieptan");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-card"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
        }}
      >
        <div className="login-left">
          <div className="logo">TEALHAVEN</div>

          <h1>Đăng nhập</h1>

          <p className="sub-text">
            Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục.
          </p>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>

        {/* <div className="login-right">
          <img
          src={loginBg}
          alt="dashboard"
        />
        </div> */}
      </div>
    </div>
  );
}

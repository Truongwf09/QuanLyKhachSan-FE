import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/profile.css";

export default function Profile() {
  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const formatDate = (d) => {
    if (!d) return "";

    return new Date(d).toISOString().split("T")[0];
  };

  const loadProfile = async () => {
    try {
      const res = await API.get("/khachhang/profile");

      setData({
        ...res.data,
        NgSinh: formatDate(res.data.NgSinh),
      });
    } catch {
      alert("Lỗi load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await API.put("/khachhang/profile", data);

      alert("Cập nhật thành công");

      setEdit(false);

      loadProfile();
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handleChangePassword = async () => {
    try {
      await API.put("/khachhang/change-password", passwordData);

      alert("Đổi mật khẩu thành công");

      setShowPassword(false);

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div className="profile-left">
            <h1>👨‍💼</h1>

            <h3>{data.HoTenKH}</h3>

            <p>{data.Email}</p>

            <div className="stats">
              <div>
                <span>12</span> Đặt phòng
              </div>

              <div>
                <span>5</span> Hoàn tất
              </div>

              <div>
                <span>2</span> Đang xử lý
              </div>
            </div>
          </div>

          <div className="profile-right">
            <h2>Thông tin tài khoản</h2>

            <div className="form-card">
              <input
                name="HoTenKH"
                value={data.HoTenKH || ""}
                disabled={!edit}
                onChange={handleChange}
                placeholder="Họ tên"
              />

              <input value={data.Email || ""} disabled />

              <input
                name="SDT"
                value={data.SDT || ""}
                disabled={!edit}
                onChange={handleChange}
                placeholder="SĐT"
              />

              <input
                name="DiaChi"
                value={data.DiaChi || ""}
                disabled={!edit}
                onChange={handleChange}
                placeholder="Địa chỉ"
              />

              <select
                name="GioiTinh"
                value={data.GioiTinh || ""}
                disabled={!edit}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <input
                type="date"
                name="NgSinh"
                value={data.NgSinh || ""}
                disabled={!edit}
                onChange={handleChange}
              />
            </div>

            {!edit ? (
              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setEdit(true)}>
                  Sửa
                </button>

                <button
                  className="btn-password"
                  onClick={() => setShowPassword(true)}
                >
                  Đổi mật khẩu
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                <button className="btn" onClick={handleUpdate}>
                  Lưu
                </button>

                <button
                  className="btn-danger"
                  onClick={() => {
                    setEdit(false);
                    loadProfile();
                  }}
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPassword && (
        <div className="forgot-overlay">
          <div className="forgot-modal">
            <h3>Đổi mật khẩu</h3>

            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button className="btn" onClick={handleChangePassword}>
              Lưu mật khẩu
            </button>

            <button
              className="btn-danger"
              onClick={() => {
                setShowPassword(false);

                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/ProfileLeTan.css";

export default function ProfileLeTan() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/nhanvien/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Lỗi lấy hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Đang tải thông tin...</div>;
  }

  if (!profile) {
    return <div className="profile-loading">Không tìm thấy thông tin.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>

          <h2>{profile.HoTen}</h2>

          <p>{profile.TenCV}</p>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <label>Mã nhân viên</label>
            <span>{profile.MaQTV}</span>
          </div>

          <div className="profile-row">
            <label>Email</label>
            <span>{profile.Email}</span>
          </div>

          <div className="profile-row">
            <label>Số điện thoại</label>
            <span>{profile.SDT || "Chưa cập nhật"}</span>
          </div>

          <div className="profile-row">
            <label>Giới tính</label>
            <span>{profile.GioiTinh || "Chưa cập nhật"}</span>
          </div>

          <div className="profile-row">
            <label>Ngày sinh</label>
            <span>
              {profile.NgSinh
                ? new Date(profile.NgSinh).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </span>
          </div>

          <div className="profile-row">
            <label>Địa chỉ</label>
            <span>{profile.DiaChi || "Chưa cập nhật"}</span>
          </div>

          <div className="profile-row">
            <label>Chi nhánh</label>
            <span>{profile.TenCN}</span>
          </div>

          <div className="profile-row">
            <label>Trạng thái</label>

            <span
              className={
                profile.TrangThai === 1 ? "status active" : "status inactive"
              }
            >
              {profile.TrangThai === 1 ? "Đang làm việc" : "Đã nghỉ việc"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

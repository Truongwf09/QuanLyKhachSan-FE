import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/admin.css";
import "../../styles/accountsQL.css";

import { FaRedo, FaLock, FaTrash, FaSearch } from "react-icons/fa";

export default function Accounts() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [chucvu, setChucVu] = useState([]);

  const [form, setForm] = useState({
    HoTen: "",
    Email: "",
    MatKhau: "",
    MaCV: "",
  });

  // 🔥 LOAD DATA THẬT
  const loadData = async () => {
    try {
      const res = await api.get("/nhanvien");
      setData(res.data);

      const cv = await api.get("/chucvu");
      setChucVu(cv.data);
    } catch (err) {
      console.error("Lỗi load:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 THÊM
  const handleCreate = async () => {
    try {
      await api.post("/nhanvien", {
        ...form,
        MaCN: user.MaCN, // gán chi nhánh
      });

      setForm({
        HoTen: "",
        Email: "",
        MatKhau: "",
        MaCV: "",
      });

      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Thêm thất bại");
    }
  };

  // 🔥 XOÁ
  const handleDelete = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn xoá?");
    if (!ok) return;

    try {
      await api.delete(`/nhanvien/${id}`);

      // 🔥 update UI ngay
      setData((prev) => prev.filter((tk) => tk.MaQTV !== id));
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại");
    }
  };

  // 🔥 SỬA
  const handleUpdate = async () => {
    try {
      await api.put(`/nhanvien/${editing.MaQTV}`, editing);

      setEditing(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="acc-page">
      <div className="acc-header">
        <h2>Quản lý tài khoản</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FORM THÊM */}
      {showForm && (
        <div className="acc-form-card">
          <input
            placeholder="Họ tên"
            value={form.HoTen}
            onChange={(e) => setForm({ ...form, HoTen: e.target.value })}
          />

          <input
            placeholder="Email"
            value={form.Email}
            onChange={(e) => setForm({ ...form, Email: e.target.value })}
          />

          <input
            placeholder="Mật khẩu"
            value={form.MatKhau}
            onChange={(e) => setForm({ ...form, MatKhau: e.target.value })}
          />

          <select
            value={form.MaCV}
            onChange={(e) => setForm({ ...form, MaCV: e.target.value })}
          >
            <option value="">Chức vụ</option>
            {chucvu.map((cv) => (
              <option key={cv.MaCV} value={cv.MaCV}>
                {cv.TenCV}
              </option>
            ))}
          </select>

          <button className="btn" onClick={handleCreate}>
            Lưu
          </button>
        </div>
      )}

      {/* FORM SỬA */}
      {editing && (
        <div className="acc-form-card">
          <h3>Sửa tài khoản</h3>

          <input
            value={editing.HoTen || ""}
            onChange={(e) => setEditing({ ...editing, HoTen: e.target.value })}
          />

          <input
            value={editing.Email || ""}
            onChange={(e) => setEditing({ ...editing, Email: e.target.value })}
          />

          <select
            value={editing.MaCV || ""}
            onChange={(e) => setEditing({ ...editing, MaCV: e.target.value })}
          >
            {chucvu.map((cv) => (
              <option key={cv.MaCV} value={cv.MaCV}>
                {cv.TenCV}
              </option>
            ))}
          </select>

          <div className="acc-actions">
            <button className="btn" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="btn-danger" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="acc-table">
        <div className="acc-table-header">
          <span>Mã</span>
          <span>Họ tên</span>
          <span>Email</span>
          <span>Mật khẩu</span>
          <span>Chức vụ</span>
          <span>Hành động</span>
        </div>

        {data.map((tk) => (
          <div className="acc-table-row" key={tk.MaQTV}>
            <span>{tk.MaQTV}</span>
            <span>{tk.HoTen}</span>
            <span>{tk.Email}</span>
            <span>********</span>
            <span>{chucvu.find((cv) => cv.MaCV === tk.MaCV)?.TenCV}</span>

            <span className="acc-actions">
              <button
                className="btn-danger"
                onClick={() => handleDelete(tk.MaQTV)}
              >
                Xoá
              </button>

              <button className="btn" onClick={() => setEditing(tk)}>
                Sửa
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

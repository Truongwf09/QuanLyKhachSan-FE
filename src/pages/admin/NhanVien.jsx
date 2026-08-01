import { useEffect, useState } from "react";
import api from "../../services/api";
import { normalizeDate } from "../../utils/date";
import "../../styles/admin.css";
import "../../styles/nhanvienAdmin.css";

import { FaUserSlash, FaUserCheck, FaEdit, FaKey, FaEye } from "react-icons/fa";

export default function NhanVien() {
  const [data, setData] = useState([]);
  const [chinhanh, setChiNhanh] = useState([]);
  const [chucvu, setChucVu] = useState([]);

  const [form, setForm] = useState({
    HoTen: "",
    Email: "",
    SDT: "",
    GioiTinh: "Nam",
    NgSinh: "",
    DiaChi: "",
    MaCN: "",
    MaCV: "",
  });

  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const mapRole = {
    CV01: "Admin",
    CV02: "Lễ Tân",
    CV03: "Quản lý chi nhánh",
    CV04: "Nhân viên dọn dẹp",
  };
  // 🔥 load data
  const loadData = async () => {
    const res = await api.get("/nhanvien");

    setData(
      res.data.map((nv) => ({
        ...nv,
        NgSinh: normalizeDate(nv.NgSinh),
      })),
    );

    const cn = await api.get("/chinhanh");
    setChiNhanh(cn.data);

    const cv = await api.get("/chucvu");
    setChucVu(cv.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 thêm
  const handleCreate = async () => {
    await api.post("/nhanvien", {
      ...form,
      NgSinh: normalizeDate(form.NgSinh),
    });

    setForm({
      HoTen: "",
      Email: "",
      SDT: "",
      GioiTinh: "Nam",
      NgSinh: "",
      DiaChi: "",
      MaCN: "",
      MaCV: "",
    });

    setShowForm(false);
    loadData();
  };

  // 🔥 xoá
  const handleToggleStatus = async (nv) => {
    const text =
      nv.TrangThai === 1
        ? "Cho nhân viên nghỉ việc?"
        : "Kích hoạt lại nhân viên?";

    if (!window.confirm(text)) return;

    await api.put(`/nhanvien/status/${nv.MaQTV}`);

    loadData();
  };
  const handleReset = async (id) => {
    if (!window.confirm("Reset mật khẩu về 123456?")) return;

    const res = await api.put(`/nhanvien/reset/${id}`);

    alert(res.data.message);
  };

  // 🔥 sửa
  const handleUpdate = async () => {
    await api.put(`/nhanvien/${editing.MaQTV}`, {
      ...editing,
      NgSinh: normalizeDate(editing.NgSinh),
    });

    setEditing(null);
    loadData();
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="nv-page-header">
      <div className="nv-header">
        <h2>Quản lý nhân viên</h2>
        <button className="nv-btn" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FORM THÊM */}
      {showForm && (
        <div className="nv-form-card">
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
            placeholder="SĐT"
            value={form.SDT}
            onChange={(e) => setForm({ ...form, SDT: e.target.value })}
          />

          <select
            value={form.GioiTinh}
            onChange={(e) => setForm({ ...form, GioiTinh: e.target.value })}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <input
            type="date"
            value={form.NgSinh}
            onChange={(e) => setForm({ ...form, NgSinh: e.target.value })}
          />

          <input
            placeholder="Địa chỉ"
            value={form.DiaChi}
            onChange={(e) => setForm({ ...form, DiaChi: e.target.value })}
          />

          <select
            value={form.MaCN}
            onChange={(e) => setForm({ ...form, MaCN: e.target.value })}
          >
            <option value="">Chi nhánh</option>
            {chinhanh.map((cn) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ))}
          </select>

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
        <div className="nv-form-card">
          <h3>Sửa nhân viên</h3>

          <input
            value={editing.HoTen}
            onChange={(e) => setEditing({ ...editing, HoTen: e.target.value })}
          />

          <input
            value={editing.Email}
            onChange={(e) => setEditing({ ...editing, Email: e.target.value })}
          />

          <input
            value={editing.SDT}
            onChange={(e) => setEditing({ ...editing, SDT: e.target.value })}
          />

          <select
            value={editing.GioiTinh}
            onChange={(e) =>
              setEditing({ ...editing, GioiTinh: e.target.value })
            }
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <input
            type="date"
            value={editing.NgSinh}
            onChange={(e) => setEditing({ ...editing, NgSinh: e.target.value })}
          />

          <input
            value={editing.DiaChi}
            onChange={(e) => setEditing({ ...editing, DiaChi: e.target.value })}
          />

          <select
            value={editing.MaCN}
            onChange={(e) => setEditing({ ...editing, MaCN: e.target.value })}
          >
            {chinhanh.map((cn) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ))}
          </select>

          <select
            value={editing.MaCV}
            onChange={(e) => setEditing({ ...editing, MaCV: e.target.value })}
          >
            {chucvu.map((cv) => (
              <option key={cv.MaCV} value={cv.MaCV}>
                {cv.TenCV}
              </option>
            ))}
          </select>

          <div className="nv-btn-group">
            <button className="nv-btn" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="nv-btn-cancel" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {selected && (
        <div className="nv-modal-overlay">
          <div className="nv-modal">
            <h3>Chi tiết nhân viên</h3>

            <p>
              <b>Mã QTV:</b> {selected.MaQTV}
            </p>
            <p>
              <b>Họ tên:</b> {selected.HoTen}
            </p>
            <p>
              <b>Email:</b> {selected.Email}
            </p>
            <p>
              <b>SĐT:</b> {selected.SDT}
            </p>
            <p>
              <b>Giới tính:</b> {selected.GioiTinh}
            </p>
            <p>
              <b>Ngày sinh:</b> {selected.NgSinh}
            </p>
            <p>
              <b>Chi nhánh:</b> {selected.TenCN}
            </p>
            <p>
              <b>Chức vụ:</b> {selected.MaCV}
            </p>
            <p>
              <b>Địa chỉ:</b> {selected.DiaChi}
            </p>
            <p>
              <b>Trạng thái:</b>

              {selected.TrangThai === 1 ? " Đang làm" : " Nghỉ việc"}
            </p>
            <button className="nv-btn-cancel" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="nv-table">
        <div className="nv-table-header">
          <span>Mã QTV</span>
          <span>Họ tên</span>
          <span>Email</span>
          <span>Chi nhánh</span>
          <span>Chức vụ</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>

        {currentData.map((nv) => (
          <div className="nv-table-row" key={nv.MaQTV}>
            <span>{nv.MaQTV}</span>
            <span>{nv.HoTen}</span>
            <span>{nv.Email}</span>
            <span>{nv.TenCN || nv.MaCN}</span>
            <span>{mapRole[nv.MaCV]}</span>

            {/* Trạng thái */}
            <span className="nv-status-cell">
              <span
                className={
                  nv.TrangThai === 1 ? "nv-status-active" : "nv-status-stop"
                }
              >
                {nv.TrangThai === 1 ? "Đang làm" : "Nghỉ việc"}
              </span>
            </span>

            {/* Hành động */}
            <span className="nv-action-cell">
              <div className="nv-icon-actions">
                {/* Nghỉ việc / Kích hoạt */}
                <button
                  className={
                    nv.TrangThai === 1
                      ? "nv-icon-btn danger"
                      : "nv-icon-btn success"
                  }
                  title={nv.TrangThai === 1 ? "Cho nghỉ việc" : "Kích hoạt"}
                  onClick={() => handleToggleStatus(nv)}
                >
                  {nv.TrangThai === 1 ? <FaUserSlash /> : <FaUserCheck />}
                </button>

                {/* Sửa */}
                {nv.TrangThai === 1 && (
                  <button
                    className="nv-icon-btn primary"
                    title="Sửa"
                    onClick={() =>
                      setEditing({
                        MaQTV: nv.MaQTV,
                        HoTen: nv.HoTen,
                        Email: nv.Email,
                        SDT: nv.SDT,
                        GioiTinh: nv.GioiTinh,
                        NgSinh: normalizeDate(nv.NgSinh),
                        DiaChi: nv.DiaChi,
                        MaCN: nv.MaCN,
                        MaCV: nv.MaCV,
                      })
                    }
                  >
                    <FaEdit />
                  </button>
                )}

                {/* Reset mật khẩu */}
                <button
                  className="nv-icon-btn warning"
                  title="Reset mật khẩu"
                  onClick={() => handleReset(nv.MaQTV)}
                >
                  <FaKey />
                </button>

                {/* Chi tiết */}
                <button
                  className="nv-icon-btn info"
                  title="Chi tiết"
                  onClick={() => setSelected(nv)}
                >
                  <FaEye />
                </button>
              </div>
            </span>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-arrow"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>

        <div className="page-info">
          Trang
          <span className="page-current">{currentPage}</span>/
          <span>{totalPages}</span>
        </div>

        <button
          className="page-arrow"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import { normalizeDate } from "../../utils/date";
import "../../styles/admin.css";
import "../../styles/customersQL.css";

import { FaSearch, FaEdit, FaTrash, FaEye, FaUser } from "react-icons/fa";

export default function Customer() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    HoTenKH: "",
    Email: "",
    SDT: "",
    GioiTinh: "Nam",
    NgSinh: "",
    DiaChi: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    const res = await api.get("/khachhang");

    setData(
      res.data.map((kh) => ({
        ...kh,
        NgSinh: normalizeDate(kh.NgSinh),
      })),
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khách hàng này?")) return;

    await api.delete(`/customers/${id}`);

    loadData();
  };
  const handleUpdate = async () => {
    await api.put(`/customers/${editing.MaKH}`, editing);

    setEditing(null);

    loadData();
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="customer-page">
      <div className="customer-header">
        <h2>Quản lý khách hàng</h2>
        {/* <button className="btn-nv" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button> */}
      </div>

      {/* FORM THÊM */}
      {/* {showForm && (
        <div className="form-card-nv">
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

          <button className="btn" onClick={handleCreate}>
            Lưu
          </button>
        </div>
      )} */}

      {/* FORM SỬA */}
      {editing && (
        <div className="form-card-nv edit">
          <h3>Sửa khách hàng</h3>

          <input
            value={editing.HoTenKH}
            onChange={(e) =>
              setEditing({ ...editing, HoTenKH: e.target.value })
            }
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

          {/* <select
            value={editing.MaCN}
            onChange={(e) =>
              setEditing({ ...editing, MaCN: e.target.value })
            }
          >
            {chinhanh.map((cn) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ))}
          </select>

          <select
            value={editing.MaCV}
            onChange={(e) =>
              setEditing({ ...editing, MaCV: e.target.value })
            }
          >
            {chucvu.map((cv) => (
              <option key={cv.MaCV} value={cv.MaCV}>
                {cv.TenCV}
              </option>
            ))}
          </select> */}

          <div className="action-buttons">
            <button className="btn" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="btn-danger" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chi tiết khách hàng</h3>

            <p>
              <b>Mã KH:</b> {selected.MaKH}
            </p>
            <p>
              <b>Họ tên:</b> {selected.HoTenKH}
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
              <b>Địa chỉ:</b> {selected.DiaChi}
            </p>

            <button className="btn-danger" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="customer-table">
        <div className="customer-table-header">
          <span>Mã KH</span>
          <span>Họ tên</span>
          <span>Email</span>
          <span>Số điện thoại</span>
          <span>Hành động</span>
        </div>

        {currentData.map((nv) => (
          <div className="customer-table-row" key={nv.MaKH}>
            <span>{nv.MaKH}</span>
            <span>{nv.HoTenKH}</span>
            <span className="email-cell">{nv.Email}</span>
            <span>{nv.SDT}</span>
            {/* <span>{nv.TenCN || nv.MaCN}</span>
            <span>{mapRole[nv.MaCV]}</span> */}

            <span className="customer-actions">
              <button
                className="btn-danger"
                onClick={() => handleDelete(nv.MaQTV)}
              >
                Xoá
              </button>
              <button
                className="btn"
                onClick={() =>
                  setEditing({
                    MaQTV: nv.MaQTV || "",
                    HoTen: nv.HoTen || "",
                    Email: nv.Email || "",
                    SDT: nv.SDT || "",
                    GioiTinh: nv.GioiTinh || "Nam",
                    NgSinh: normalizeDate(nv.NgSinh) || "",
                    DiaChi: nv.DiaChi || "",
                    // MaCN: nv.MaCN || "",
                    // MaCV: nv.MaCV || ""
                  })
                }
              >
                Sửa
              </button>
              <button className="btn" onClick={() => setSelected(nv)}>
                Chi tiết
              </button>
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

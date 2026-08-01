import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/admin.css";
import "../../styles/chinhanhAdmin.css";

export default function ChiNhanh() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [form, setForm] = useState({
    TenCN: "",
    DiaChi: "",
    MoTa: "",
    TrangThai: "hoạt động",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/chinhanh");
    console.log(res.data);
    setData(res.data);
  };

  const handleAdd = async () => {
    try {
      await api.post("/chinhanh", {
        ...form,
        TrangThai: "hoạt động",
      });
      setShowForm(false);
      load();
    } catch (err) {
      alert("Lỗi thêm chi nhánh");
    }
  };
  const handleEdit = (cn) => {
    setEditing(cn);
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn dừng hoạt động chi nhánh này?")) return;
  //   await api.put(`/chinhanh/${id}/hide`);
  //   load();
  // };
  // const handleHide = async (id) => {
  //   if (
  //     !window.confirm(
  //       "Bạn muốn thay đổi trạng thái chi nhánh?"
  //     )
  //   ) return;

  //   await api.put(`/chinhanh/${id}/status`);

  //   load();
  // };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/chinhanh/${id}/status`);

      load();
    } catch (err) {
      alert("Không thể cập nhật trạng thái");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/chinhanh/${editing.MaCN}`, editing);

      alert("Cập nhật thành công");

      setEditing(null);
      load(); // reload list
    } catch (err) {
      alert("Lỗi cập nhật");
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* HEADER */}
      <div className="cn-page-header">
        <h2>Quản lý chi nhánh</h2>
        <button className="cn-btn" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="cn-form-card">
          <input
            placeholder="Tên chi nhánh"
            onChange={(e) => setForm({ ...form, TenCN: e.target.value })}
          />

          <input
            placeholder="Địa chỉ"
            onChange={(e) => setForm({ ...form, DiaChi: e.target.value })}
          />

          <input
            placeholder="Mô tả"
            onChange={(e) => setForm({ ...form, MoTa: e.target.value })}
          />

          <button className="cn-btn" onClick={handleAdd}>
            Lưu
          </button>
        </div>
      )}

      {editing && (
        <div className="cn-form-card">
          <h3>Sửa chi nhánh</h3>

          <input
            value={editing.TenCN}
            onChange={(e) => setEditing({ ...editing, TenCN: e.target.value })}
          />

          <input
            value={editing.DiaChi}
            onChange={(e) => setEditing({ ...editing, DiaChi: e.target.value })}
          />

          <input
            value={editing.MoTa}
            onChange={(e) => setEditing({ ...editing, MoTa: e.target.value })}
          />
          <div className="cn-btn-group">
            <button className="cn-btn" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="cn-btn-cancel" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="cn-table">
        <div className="cn-table-header">
          <span>Mã CN</span>
          <span>Tên</span>
          <span>Địa chỉ</span>
          <span>Mô tả</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>

        {currentData.map((cn) => (
          <div className="cn-table-row" key={cn.MaCN}>
            <span>{cn.MaCN}</span>
            <span>{cn.TenCN}</span>
            <span>{cn.DiaChi}</span>
            <span>{cn.MoTa}</span>
            <span
              className={
                cn.TrangThai === "hoạt động"
                  ? "cn-status-active"
                  : cn.TrangThai === "không hoạt động"
                    ? "cn-status-stop"
                    : "cn-status-close"
              }
            >
              {cn.TrangThai || "Chưa cập nhật"}
            </span>

            <span>
              <div className="cn-btn-group">
                <button
                  className="cn-btn-cancel"
                  onClick={() => handleToggleStatus(cn.MaCN)}
                >
                  {cn.TrangThai === "hoạt động" ? "Ẩn" : "Mở"}
                </button>
                <button className="cn-btn" onClick={() => handleEdit(cn)}>
                  Sửa
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

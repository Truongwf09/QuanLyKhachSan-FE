import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/admin.css";
import "../../styles/quyenAdmin.css";

export default function Quyen() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    MaQuyen: "",
    TenQuyen: "",
    MoTa: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    try {
      const res = await API.get("/quyen");

      setData(res.data);
    } catch {
      alert("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!editing) {
        await API.post("/quyen", form);
      } else {
        await API.put(`/quyen/${form.MaQuyen}`, form);
      }

      setForm({
        MaQuyen: "",
        TenQuyen: "",
        MoTa: "",
      });

      setEditing(false);

      loadData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa quyền?")) return;

    await API.delete(`/quyen/${id}`);

    loadData();
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="permission-page">
      {/* HEADER */}

      <div className="permission-header">
        <h2>Quản lý quyền</h2>

        <button
          className="permission-save"
          onClick={() => {
            setShowForm(!showForm);

            if (editing) {
              setEditing(false);

              setForm({
                MaQuyen: "",
                TenQuyen: "",
                MoTa: "",
              });
            }
          }}
        >
          Thêm mới
        </button>
      </div>

      {/* FORM */}

      {(showForm || editing) && (
        <div className={`permission-card ${editing ? "edit" : ""}`}>
          {editing && <h3>Sửa quyền</h3>}

          <input
            placeholder="Mã quyền"
            disabled={editing}
            value={form.MaQuyen}
            onChange={(e) =>
              setForm({
                ...form,
                MaQuyen: e.target.value,
              })
            }
          />

          <input
            placeholder="Tên quyền"
            value={form.TenQuyen}
            onChange={(e) =>
              setForm({
                ...form,
                TenQuyen: e.target.value,
              })
            }
          />
          {/* 
            <input
            placeholder="Mô tả"
            value={form.MoTa}
            onChange={(e) =>
                setForm({
                ...form,
                MoTa: e.target.value
                })
            }
            /> */}

          <div className="permission-actions">
            <button className="permission-save" onClick={handleSubmit}>
              {editing ? "Cập nhật" : "Lưu"}
            </button>

            <button
              className="permission-cancel"
              onClick={() => {
                setEditing(false);

                setShowForm(false);

                setForm({
                  MaQuyen: "",
                  TenQuyen: "",
                  MoTa: "",
                });
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}

      <div className="permission-table">
        <div className="permission-table-header">
          <span>Mã quyền</span>

          <span>Tên quyền</span>

          <span>Hành động</span>
        </div>

        {currentData.map((item) => (
          <div className="permission-table-row" key={item.MaQuyen}>
            <span>{item.MaQuyen}</span>

            <span>{item.TenQuyen}</span>

            <span className="permission-actions">
              <button
                className="permission-cancel"
                onClick={() => handleDelete(item.MaQuyen)}
              >
                Xóa
              </button>

              <button
                className="permission-save"
                onClick={() => {
                  setForm({
                    MaQuyen: item.MaQuyen,
                    TenQuyen: item.TenQuyen,
                    MoTa: item.MoTa,
                  });

                  setEditing(true);

                  setShowForm(false);
                }}
              >
                Sửa
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

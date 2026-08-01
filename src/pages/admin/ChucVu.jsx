import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/chucvuAdmin.css";
import "../../styles/admin.css";

export default function ChucVu() {
  const [data, setData] = useState([]);
  const [showPermission, setShowPermission] = useState(false);
  const [form, setForm] = useState({
    TenCV: "",
    MoTa: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);

  const [permissions, setPermissions] = useState([]);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    try {
      const res = await API.get("/chucvu");
      setData(res.data);
    } catch {
      alert("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleChangeStatus = async (MaCV, currentStatus) => {
    const newStatus =
      currentStatus === "hoạt động" ? "ngừng hoạt động" : "hoạt động";

    const message =
      newStatus === "ngừng hoạt động"
        ? "Bạn có chắc chắn muốn ngưng hoạt động chức vụ này không?"
        : "Bạn có chắc chắn muốn kích hoạt lại chức vụ này không?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      await API.put(`/chucvu/${MaCV}/status`, {
        TrangThai: newStatus,
      });

      alert("Cập nhật trạng thái thành công");

      await loadData();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };
  const handleSubmit = async () => {
    try {
      if (!editing) {
        await API.post("/chucvu", {
          TenCV: form.TenCV,
          MoTa: form.MoTa,
        });
      } else {
        await API.put(`/chucvu/${form.MaCV}`, form);
      }

      setForm({ TenCV: "", MoTa: "" });
      setEditing(false);
      setShowForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa chức vụ?")) return;
    await API.delete(`/chucvu/${id}`);
    loadData();
  };
  const openPermissionModal = async (cv) => {
    setSelectedCV(cv);

    // Lấy toàn bộ quyền
    const all = await API.get("/quyen");

    setPermissions(all.data);

    // Lấy quyền của chức vụ

    const current = await API.get(`/chucvu/${cv.MaCV}/permissions`);

    setSelectedPermissions(current.data.map((q) => q.MaQuyen));

    setShowPermission(true);
  };
  const togglePermission = (MaQuyen) => {
    if (selectedPermissions.includes(MaQuyen)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== MaQuyen));
    } else {
      setSelectedPermissions([...selectedPermissions, MaQuyen]);
    }
  };
  const savePermissions = async () => {
    await API.post(
      `/chucvu/${selectedCV.MaCV}/permissions`,

      {
        permissions: selectedPermissions,
      },
    );

    alert("Phân quyền thành công");

    setShowPermission(false);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="cv-page-header">
      <div className="cv-header">
        <h2>Quản lý chức vụ</h2>

        <button
          className="cv-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (editing) {
              setEditing(false);
              setForm({ TenCV: "", MoTa: "" });
            }
          }}
        >
          Thêm mới
        </button>
      </div>

      {/* FORM THÊM / SỬA */}
      {(showForm || editing) && (
        <div className={`cv-form ${editing ? "edit" : ""}`}>
          {editing && <h3>Sửa chức vụ</h3>}

          {/* ✅ Chỉ hiện Mã CV khi đang sửa (readonly), ẩn khi thêm mới */}
          {editing && (
            <input placeholder="Mã chức vụ" value={form.MaCV} disabled />
          )}

          <input
            placeholder="Tên chức vụ"
            value={form.TenCV}
            onChange={(e) => setForm({ ...form, TenCV: e.target.value })}
          />

          <input
            placeholder="Mô tả"
            value={form.MoTa}
            onChange={(e) => setForm({ ...form, MoTa: e.target.value })}
          />

          <div className="cv-btn-group">
            <button className="cv-btn" onClick={handleSubmit}>
              {editing ? "Cập nhật" : "Lưu"}
            </button>

            <button
              className="cv-btn-cancel"
              onClick={() => {
                setEditing(false);
                setShowForm(false);
                setForm({ TenCV: "", MoTa: "" });
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="cv-table">
        <div className="cv-table-header">
          <span>Mã CV</span>
          <span>Tên chức vụ</span>
          <span>Mô tả</span>
          <span>Hành động</span>
        </div>

        {currentData.map((cv) => (
          <div className="cv-table-row" key={cv.MaCV}>
            <span>{cv.MaCV}</span>
            <span>{cv.TenCV}</span>
            <span>{cv.MoTa}</span>

            <span className="cv-action">
              <button
                className={
                  cv.TrangThai === "hoạt động" ? "cv-btn-cancel" : "cv-btn"
                }
                onClick={() => handleChangeStatus(cv.MaCV, cv.TrangThai)}
              >
                {cv.TrangThai === "hoạt động" ? "Ẩn" : "Hiển thị"}
              </button>
              <button
                className="cv-btn"
                onClick={() => openPermissionModal(cv)}
              >
                Phân quyền
              </button>
              <button
                className="cv-btn"
                onClick={() => {
                  setForm({
                    MaCV: cv.MaCV,
                    TenCV: cv.TenCV,
                    MoTa: cv.MoTa,
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
      {showPermission && (
        <div className="modal-overlay-cv">
          <div className="modal-cv">
            <h2>Phân quyền cho chức vụ: {selectedCV?.TenCV}</h2>

            <div className="permission-grid">
              {permissions.map((q) => (
                <label key={q.MaQuyen}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(q.MaQuyen)}
                    onChange={() => togglePermission(q.MaQuyen)}
                  />

                  {q.TenQuyen}
                </label>
              ))}
            </div>

            <div className="action-buttons-quyen">
              <button className="cv-modal-save" onClick={savePermissions}>
                Lưu
              </button>

              <button
                className="cv-modal-cancel"
                onClick={() => setShowPermission(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
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

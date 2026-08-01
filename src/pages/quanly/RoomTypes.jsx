import { useEffect, useState } from "react";
import albumIcon from "../../assets/album.png";
import "../../styles/admin.css";
import "../../styles/roomtypesQL.css";

import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const API = "http://localhost:8080/api/loaiphong";

export default function RoomTypes() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [form, setForm] = useState({
    TenLoai: "",
    GiaPhong: "",
    MoTa: "",
    SoNguoiToiDa: "",
    HinhAnh: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`, // 🔥 bắt buộc
  };

  // ================= LOAD =================
  // const loadData = async () => {
  //   try {
  //     const res = await fetch(API, { headers });
  //     const result = await res.json();
  //     console.log("LOAIPHONG:", result);
  //     setData(result);
  //   } catch (err) {
  //     console.error("Lỗi load loại phòng:", err);
  //   }
  // };

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      console.log("USER:", user);
      console.log("ROLE:", user.role);
      console.log("MACN:", user.MaCN);

      const res = await fetch(API, { headers });
      const result = await res.json();

      console.log("LOAIPHONG:", result);

      setData(result);
    } catch (err) {
      console.error("Lỗi load loại phòng:", err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("TenLoai", form.TenLoai);
      formData.append("MoTa", form.MoTa);
      formData.append("SoNguoiToiDa", form.SoNguoiToiDa);
      if (imageFile) {
        formData.append("HinhAnh", imageFile);
      }
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      console.log(result);
      setForm({
        TenLoai: "",
        MoTa: "",
        SoNguoiToiDa: "",
        HinhAnh: "",
      });
      setImageFile(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleHide = async (id) => {
    if (!window.confirm("Ẩn loại phòng này?")) return;

    try {
      await fetch(`${API}/${id}/hide`, {
        method: "PUT",
        headers,
      });

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleShow = async (id) => {
    if (!window.confirm("Hiển thị lại loại phòng này?")) return;

    try {
      await fetch(`${API}/${id}/show`, {
        method: "PUT",
        headers,
      });

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("TenLoai", editing.TenLoai);
      formData.append("MoTa", editing.MoTa);
      formData.append("SoNguoiToiDa", editing.SoNguoiToiDa);
      if (imageFile) {
        formData.append("HinhAnh", imageFile);
      }
      const res = await fetch(`${API}/${editing.MaLoai}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      console.log(result);
      setEditing(null);
      setImageFile(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="type-page">
      <div className="type-header">
        <h2>Quản lý loại phòng</h2>
        <button className="type-add" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FORM THÊM */}
      {showForm && (
        <div className="type-form">
          <input
            placeholder="Tên loại phòng"
            value={form.TenLoai}
            onChange={(e) => setForm({ ...form, TenLoai: e.target.value })}
          />

          {/* <input
            type="number"
            placeholder="Giá"
            value={form.GiaPhong}
            onChange={(e) => setForm({ ...form, GiaPhong: e.target.value })}
          /> */}

          <input
            placeholder="Mô tả"
            value={form.MoTa}
            onChange={(e) => setForm({ ...form, MoTa: e.target.value })}
          />

          <input
            placeholder="Số người tối đa"
            value={form.SoNguoiToiDa}
            onChange={(e) => setForm({ ...form, SoNguoiToiDa: e.target.value })}
          />

          <div className="type-upload">
            <label htmlFor="upload" className="type-upload-btn">
              <img src={albumIcon} alt="photo" className="menu-icon" />
            </label>

            <input
              id="upload"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
            />
            <div className="type-preview">
              {imageFile ? (
                <>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="upload-thumb"
                    alt=""
                  />
                  <span>{imageFile.name}</span>
                </>
              ) : (
                <span>Chưa chọn ảnh</span>
              )}
            </div>
          </div>

          <button className="type-save" onClick={handleCreate}>
            Lưu
          </button>
        </div>
      )}

      {/* FORM EDIT */}
      {editing && (
        <div className="type-form">
          <h3>Sửa loại phòng</h3>

          <input value={editing.MaLoai} disabled />

          <input
            value={editing.TenLoai}
            onChange={(e) =>
              setEditing({ ...editing, TenLoai: e.target.value })
            }
          />

          {/* <input
            type="number"
            value={editing.GiaPhong}
            onChange={(e) =>
              setEditing({ ...editing, GiaPhong: e.target.value })
            }
          /> */}

          <input
            value={editing.MoTa}
            onChange={(e) => setEditing({ ...editing, MoTa: e.target.value })}
          />

          <input
            value={editing.SoNguoiToiDa}
            onChange={(e) =>
              setEditing({ ...editing, SoNguoiToiDa: e.target.value })
            }
          />

          <div className="type-upload">
            <div className="current-image">
              {editing.HinhAnh ? (
                <img
                  src={`http://localhost:8080${editing.HinhAnh}`}
                  className="type-preview img"
                  alt={editing.TenLoai}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              ) : (
                <div className="preview-empty">Chưa có ảnh</div>
              )}
            </div>

            <div className="type-form textarea">
              <input
                type="file"
                id="edit-upload"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                }}
              />
              <label htmlFor="edit-upload" className="type-upload-btn">
                Chọn ảnh mới
              </label>
              <span className="type-file-name">
                {imageFile ? imageFile.name : "Giữ nguyên ảnh cũ"}
              </span>
            </div>
          </div>

          <div className="type-buttons">
            <button className="type-save" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="type-cancel" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {/* {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chi tiết loại phòng</h3>

            <p><b>Mã loại:</b> {selected.MaLoai}</p>
            <p><b>Tên loại:</b> {selected.TenLoai}</p>
            <p><b>Giá phòng:</b> {selected.GiaPhong}</p>
            <p><b>Mô tả:</b> {selected.MoTa}</p>
            <p><b>Số người tối đa:</b> {selected.SoNguoiToiDa}</p>
            <p><b>Hình ảnh:</b> {selected.HinhAnh}</p>

            <button className="btn-danger" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )} */}

      {/* TABLE */}
      <div className="type-table">
        <div className="type-table-header">
          <span>Mã loại</span>
          <span>Tên loại</span>
          <span>Số người tối đa</span>
          <span>Mô tả</span>
          <span>Hình ảnh</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>

        {data.length === 0 ? (
          <p style={{ padding: 20 }}>Không có dữ liệu</p>
        ) : (
          currentData.map((lp) => (
            <div className="type-table-row" key={lp.MaLoai}>
              <span>{lp.MaLoai}</span>
              <span>{lp.TenLoai}</span>
              <span>{lp.SoNguoiToiDa}</span>
              <span>{lp.MoTa}</span>
              <span>
                <img
                  src={`http://localhost:8080${lp.HinhAnh}`}
                  className="type-image"
                  alt={lp.TenLoai}
                  onError={(e) => {
                    console.log(lp.HinhAnh);

                    e.target.src = "https://placehold.co/80x60?text=No+Image";
                  }}
                />
              </span>
              <span>
                {lp.TrangThai == 1 ? (
                  <div className="status-active">Đang sử dụng</div>
                ) : (
                  <div className="status-hidden">Đã ẩn</div>
                )}
              </span>
              <span className="type-buttons">
                {lp.TrangThai == 1 ? (
                  <button
                    className="type-hide"
                    onClick={() => handleHide(lp.MaLoai)}
                  >
                    Ẩn
                  </button>
                ) : (
                  <button
                    className="type-show"
                    onClick={() => handleShow(lp.MaLoai)}
                  >
                    Hiện
                  </button>
                )}

                <button className="type-edit" onClick={() => setEditing(lp)}>
                  Sửa
                </button>
                {/* <button className="type-view" onClick={() => setSelected(lp)}>
                  Chi tiết
                </button> */}
              </span>
            </div>
          ))
        )}
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

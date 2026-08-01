import { useEffect, useState } from "react";
import { getRooms, getLoaiPhong } from "../../services/api";
import "../../styles/admin.css";
import "../../styles/roomsQL.css";

import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

import { API_URL } from "../../services/backend";

const API = `${API_URL}/phong`;

export default function Rooms() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loaiPhong, setLoaiPhong] = useState([]);

  const [form, setForm] = useState({
    MaPhong: "",
    SoPhong: "",
    Tang: "",
    TinhTrangPhong: "",
    MaLoai: "",
    GiaPhong: "",
    GiaTheoGio: "",
    GiaQuaDem: "",
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ================= LOAD =================
  const loadRooms = async () => {
    try {
      const rooms = await getRooms();
      console.log("rooms:", rooms); // 👈 bắt buộc phải thấy dòng này

      const loai = await getLoaiPhong();

      setData(rooms);
      setLoaiPhong(loai);
    } catch (err) {
      console.error("Lỗi load data:", err);
    }
  };
  useEffect(() => {
    loadRooms();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert(result.message);

      setForm({
        MaPhong: "",
        SoPhong: "",
        Tang: "",
        TinhTrangPhong: "có sẵn",
        MaLoai: "",
        GiaPhong: "",
        GiaTheoGio: "",
        GiaQuaDem: "",
      });

      setShowForm(false);

      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers,
      });
      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/${editing.MaPhong}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editing),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert(result.message);

      setEditing(null);

      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeStatus = async (maPhong, status) => {
    try {
      const res = await fetch(`${API}/${maPhong}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          TinhTrangPhong: status,
        }),
      });

      const data = await res.json();

      console.log("UPDATE:", data);

      loadRooms();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="room-page">
      <div className="room-header">
        <h2>Quản lý phòng</h2>
        <button className="room-save" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FORM THÊM */}
      {showForm && (
        <div className="room-form">
          <input
            placeholder="Mã phòng"
            value={form.MaPhong}
            onChange={(e) => setForm({ ...form, MaPhong: e.target.value })}
          />
          <input
            placeholder="Số phòng"
            value={form.SoPhong}
            onChange={(e) => setForm({ ...form, SoPhong: e.target.value })}
          />
          <input
            placeholder="Tầng"
            value={form.Tang}
            onChange={(e) => setForm({ ...form, Tang: e.target.value })}
          />

          <select
            placeholder="Tình trạng phòng"
            value={form.TinhTrangPhong}
            onChange={(e) =>
              setForm({ ...form, TinhTrangPhong: e.target.value })
            }
          >
            <option value="có sẵn">Có sẵn</option>

            <option value="đang sử dụng">Đang sử dụng</option>

            <option value="đang dọn dẹp">Đang dọn dẹp</option>

            <option value="bảo trì">Bảo trì</option>
          </select>

          <select
            value={form.MaLoai}
            onChange={(e) => setForm({ ...form, MaLoai: e.target.value })}
          >
            <option value="">-- Chọn loại phòng --</option>

            {loaiPhong.map((lp) => (
              <option key={lp.MaLoai} value={lp.MaLoai}>
                {lp.MaLoai} - {lp.TenLoai}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Giá theo ngày"
            value={form.GiaPhong}
            onChange={(e) =>
              setForm({
                ...form,
                GiaPhong: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Giá theo giờ"
            value={form.GiaTheoGio}
            onChange={(e) =>
              setForm({
                ...form,
                GiaTheoGio: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Giá qua đêm"
            value={form.GiaQuaDem}
            onChange={(e) =>
              setForm({
                ...form,
                GiaQuaDem: e.target.value,
              })
            }
          />

          <button className="room-save" onClick={handleCreate}>
            Lưu
          </button>
        </div>
      )}

      {/* FORM EDIT */}
      {editing && (
        <div className="room-form">
          <h3>Sửa phòng</h3>

          <input value={editing.MaPhong} disabled />

          <input
            value={editing.SoPhong}
            onChange={(e) =>
              setEditing({ ...editing, SoPhong: e.target.value })
            }
          />

          <input
            value={editing.Tang}
            onChange={(e) => setEditing({ ...editing, Tang: e.target.value })}
          />
          <input
            type="number"
            placeholder="Giá theo ngày"
            value={editing.GiaPhong}
            onChange={(e) =>
              setEditing({
                ...editing,
                GiaPhong: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Giá theo giờ"
            value={editing.GiaTheoGio}
            onChange={(e) =>
              setEditing({
                ...editing,
                GiaTheoGio: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Giá qua đêm"
            value={editing.GiaQuaDem}
            onChange={(e) =>
              setEditing({
                ...editing,
                GiaQuaDem: e.target.value,
              })
            }
          />

          <select
            value={editing.TinhTrangPhong}
            onChange={(e) =>
              setEditing({
                ...editing,
                TinhTrangPhong: e.target.value,
              })
            }
          >
            <option value="có sẵn">Có sẵn</option>

            <option value="đang sử dụng">Đang sử dụng</option>

            <option value="đang dọn dẹp">Đang dọn dẹp</option>

            <option value="bảo trì">Bảo trì</option>
          </select>

          <select
            value={editing.MaLoai}
            onChange={(e) => setEditing({ ...editing, MaLoai: e.target.value })}
          >
            <option value="">-- Chọn loại phòng --</option>

            {loaiPhong.map((lp) => (
              <option key={lp.MaLoai} value={lp.MaLoai}>
                {lp.MaLoai} - {lp.TenLoai}
              </option>
            ))}
          </select>

          <div className="room-form-buttons">
            <button className="room-save" onClick={handleUpdate}>
              Lưu
            </button>
            <button className="room-cancel" onClick={() => setEditing(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chi tiết phòng</h3>

            <p>
              <b>Mã phòng:</b> {selected.MaPhong}
            </p>
            <p>
              <b>Số phòng:</b> {selected.SoPhong}
            </p>
            <p>
              <b>Tầng:</b> {selected.Tang}
            </p>
            <p>
              <b>Tình trạng:</b> {selected.TinhTrangPhong}
            </p>
            <p>
              <b>Mã loại:</b> {selected.MaLoai}
            </p>
            <p>
              <b>Chi nhánh:</b> {selected.MaCN}
            </p>

            <button className="btn-danger" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="room-table">
        <div className="room-table-header">
          <span>Mã</span>
          <span>Số phòng</span>
          <span>Tầng</span>
          <span>Loại</span>
          <span>Qua đêm</span>
          <span>Theo Ngày</span>
          <span>Theo Giờ(2h)</span>
          <span>Tình trạng</span>
          <span>Hành động</span>
        </div>

        {data.length === 0 ? (
          <p style={{ padding: 20 }}>Không có dữ liệu</p>
        ) : (
          data.map((r) => (
            <div className="room-table-row" key={r.MaPhong}>
              <span>{r.MaPhong}</span>
              <span>{r.SoPhong}</span>
              <span>{r.Tang}</span>
              <span>{r.MaLoai}</span>
              <span>{Number(r.GiaQuaDem).toLocaleString()}đ</span>
              <span>{Number(r.GiaPhong).toLocaleString()}đ</span>
              <span>{Number(r.GiaTheoGio).toLocaleString()}đ</span>
              <span>
                <select
                  className={`room-status ${
                    r.TinhTrangPhong === "có sẵn"
                      ? "available"
                      : r.TinhTrangPhong === "đang sử dụng"
                        ? "busy"
                        : r.TinhTrangPhong === "đang dọn dẹp"
                          ? "clean"
                          : "maintain"
                  }`}
                  value={r.TinhTrangPhong}
                  onChange={(e) =>
                    handleChangeStatus(r.MaPhong, e.target.value)
                  }
                >
                  <option value="có sẵn">Có sẵn</option>

                  <option value="đang sử dụng">Đang sử dụng</option>

                  <option value="đang dọn dẹp">Đang dọn dẹp</option>

                  <option value="bảo trì">Bảo trì</option>
                </select>
              </span>

              <span className="room-actions">
                <button
                  className="room-icon delete"
                  onClick={() => handleDelete(r.MaPhong)}
                  title="Xóa phòng"
                  aria-label={`Xóa phòng ${r.SoPhong}`}
                >
                  <FaTrash />
                </button>
                <button
                  className="room-icon edit"
                  onClick={() => setEditing({ ...r })}
                  title="Sửa phòng"
                  aria-label={`Sửa phòng ${r.SoPhong}`}
                >
                  <FaEdit />
                </button>
                {/* <button className="room-icon view" onClick={() => setSelected(r)}>
                  Chi tiết
                </button> */}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

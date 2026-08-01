import { useEffect, useState } from "react";
import { getRooms, getLoaiPhong } from "../../services/api";
import "../../styles/admin.css";
import "../../styles/roomsAdmin.css";

import { API_URL } from "../../services/backend";

const API = `${API_URL}/phong`;

export default function RoomsAd() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loaiPhong, setLoaiPhong] = useState([]);
  const [filterCN, setFilterCN] = useState("");
  const [filterLoai, setFilterLoai] = useState("");
  const [chiNhanh, setChiNhanh] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [form, setForm] = useState({
    SoPhong: "",
    Tang: "",
    TinhTrangPhong: "có sẵn",
    MaLoai: "",
    MaCN: "",
    GiaPhong: "",
    GiaTheoGio: "",
    GiaQuaDem: "",
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // const chiNhanhList = [
  //   ...new Map(data.map((r) => [r.MaCN, r])).values(),
  // ];

  const loadRooms = async () => {
    try {
      const rooms = await getRooms();
      const loai = await getLoaiPhong();
      setData(rooms);
      setLoaiPhong(loai);
      await loadChiNhanh();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const loadChiNhanh = async () => {
    try {
      const res = await fetch(`${API_URL}/chinhanh`, {
        headers,
      });
      const result = await res.json();
      setChiNhanh(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch(API, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      setForm({
        SoPhong: "",
        Tang: "",
        TinhTrangPhong: "có sẵn",
        MaLoai: "",
        MaCN: "",
      });

      setShowForm(false);
      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá phòng này?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers });
      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/${editing.MaPhong}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editing),
      });
      setEditing(null);
      loadRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeStatus = async (maPhong, status) => {
    try {
      await fetch(`${API}/${maPhong}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ TinhTrangPhong: status }),
      });
      loadRooms();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredRooms = data.filter((r) => {
    const matchCN = !filterCN || r.MaCN === filterCN;
    const matchLoai = !filterLoai || r.MaLoai === filterLoai;
    return matchCN && matchLoai;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRooms.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredRooms.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div>
      <div className="room-page-header">
        {/* HEADER */}
        <h2>Quản lý phòng toàn hệ thống</h2>
        <button className="room-save" onClick={() => setShowForm(!showForm)}>
          Thêm mới
        </button>
      </div>

      {/* FILTER */}
      <div className="room-filter">
        {/* FILTER */}
        <select value={filterCN} onChange={(e) => setFilterCN(e.target.value)}>
          <option value="">Tất cả chi nhánh</option>
          {chiNhanh.map(
            (
              cn, // ✅ đổi chiNhanhList → chiNhanh
            ) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ),
          )}
        </select>

        <select
          value={filterLoai}
          onChange={(e) => setFilterLoai(e.target.value)}
        >
          <option value="">Tất cả loại phòng</option>
          {loaiPhong.map((lp) => (
            <option key={lp.MaLoai} value={lp.MaLoai}>
              {lp.TenLoai}
            </option>
          ))}
        </select>
      </div>

      {/* FORM THÊM MỚI */}
      {showForm && (
        <div className="room-form">
          <input
            placeholder="Mã phòng"
            value={form.MaPhong}
            onChange={(e) =>
              setForm({
                ...form,
                MaPhong: e.target.value,
              })
            }
          />
          <input
            placeholder="Số phòng (vd: 101)"
            value={form.SoPhong}
            onChange={(e) => setForm({ ...form, SoPhong: e.target.value })}
          />

          <input
            placeholder="Tầng (vd: 1)"
            value={form.Tang}
            onChange={(e) => setForm({ ...form, Tang: e.target.value })}
          />
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

          <select
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

          <select
            value={form.MaCN}
            onChange={(e) => setForm({ ...form, MaCN: e.target.value })}
          >
            <option value="">-- Chọn chi nhánh --</option>
            {chiNhanh.map((cn) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ))}
          </select>

          <div className="room-form-actions">
            <button
              className="room-cancel"
              onClick={() => {
                setShowForm(false);
                setForm({
                  SoPhong: "",
                  Tang: "",
                  TinhTrangPhong: "có sẵn",
                  MaLoai: "",
                  MaCN: "",
                });
              }}
            >
              Huỷ
            </button>
            <button className="room-save" onClick={handleCreate}>
              Lưu phòng
            </button>
          </div>
        </div>
      )}

      {/* FORM SỬA */}
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
              setEditing({ ...editing, TinhTrangPhong: e.target.value })
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

          <select
            value={editing.MaCN}
            onChange={(e) => setEditing({ ...editing, MaCN: e.target.value })}
          >
            {chiNhanh.map((cn) => (
              <option key={cn.MaCN} value={cn.MaCN}>
                {cn.TenCN}
              </option>
            ))}
          </select>

          <div className="room-actions">
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
        <div className="room-modal-overlay">
          <div className="room-modal">
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
              <b>Loại phòng:</b> {selected.TenLoai || selected.MaLoai}
            </p>
            <p>
              <b>Chi nhánh:</b> {selected.TenCN || selected.MaCN}
            </p>
            <button className="room-close" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="room-table">
        <div className="room-table-header">
          <span>Mã phòng</span>
          <span>Số phòng</span>
          <span>Tầng</span>
          <span>Loại phòng</span>
          <span>Chi nhánh</span>
          <span>Qua đêm</span>
          <span>Theo ngày</span>
          <span>Theo giờ</span>
          <span>Tình trạng</span>
          <span>Hành động</span>
        </div>

        {currentData.length === 0 ? (
          <p style={{ padding: 20 }}>Không có dữ liệu</p>
        ) : (
          currentData.map((r) => (
            <div className="room-table-row" key={r.MaPhong}>
              <span>{r.MaPhong}</span>
              <span>{r.SoPhong}</span>
              <span>{r.Tang}</span>
              <span>{r.TenLoai || r.MaLoai}</span>
              <span>{r.TenCN || r.MaCN}</span>
              <span>{Number(r.GiaQuaDem).toLocaleString()}đ</span>

              <span>{Number(r.GiaPhong).toLocaleString()}đ</span>

              <span>{Number(r.GiaTheoGio).toLocaleString()}đ</span>
              <span>
                <select
                  className={`room-status ${
                    r.TinhTrangPhong === "có sẵn"
                      ? "green"
                      : r.TinhTrangPhong === "đang sử dụng"
                        ? "red"
                        : r.TinhTrangPhong === "đang dọn dẹp"
                          ? "yellow"
                          : "gray"
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
              <div className="room-table-actions">
                <button
                  className="room-cancel"
                  onClick={() => handleDelete(r.MaPhong)}
                >
                  Xoá
                </button>
                <button className="room-save" onClick={() => setEditing(r)}>
                  Sửa
                </button>
              </div>
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

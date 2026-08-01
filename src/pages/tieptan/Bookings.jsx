import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/bookingsQL.css";

export default function Bookings() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    try {
      const res = await api.get("/datphong");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirm = async (maCTDP) => {
    try {
      await api.put(`/datphong/${maCTDP}/confirm`);

      alert("Xác nhận thành công");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xác nhận");
    }
  };

  const handleCancel = async (maCTDP) => {
    const reason = prompt("Nhập lý do hủy booking");

    if (!reason) return;

    try {
      await api.put(`/datphong/${maCTDP}/cancel`, {
        reason,
      });

      alert("Đã hủy booking");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi hủy booking");
    }
  };

  return (
    <div>
      <div className="booking-page">
        <div className="booking-header">
          <h2>Booking chờ xác nhận</h2>
        </div>
      </div>

      <div className="booking-table">
        <div className="booking-table-header">
          <span>Mã ĐP</span>
          <span>Khách hàng</span>
          <span>Phòng</span>
          <span>Ngày nhận</span>
          <span>Tổng tiền</span>
          <span>Hành động</span>
        </div>

        {data.map((row) => (
          <div className="booking-table-row" key={row.MaCTDP}>
            <span>{row.MaDP}</span>

            <span>{row.HoTenKH}</span>

            <span>{row.SoPhong}</span>

            <span>{new Date(row.NgayNhanPhong).toLocaleDateString()}</span>

            <span>{Number(row.ThanhTien).toLocaleString()} đ</span>

            <span className="action-buttons-nv-letan">
              <button className="btn" onClick={() => handleConfirm(row.MaCTDP)}>
                Xác nhận
              </button>

              <button
                className="btn-danger"
                onClick={() => handleCancel(row.MaCTDP)}
              >
                Hủy
              </button>

              <button className="btn" onClick={() => setSelected(row)}>
                Chi tiết
              </button>
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div>
          <div className="booking-modal">
            <h3>Chi tiết booking</h3>

            <p>
              <b>Mã đặt:</b> {selected.MaDP}
            </p>

            <p>
              <b>Khách:</b> {selected.HoTenKH}
            </p>

            <p>
              <b>Email:</b> {selected.Email}
            </p>

            <p>
              <b>SĐT:</b> {selected.SDT}
            </p>

            <p>
              <b>Phòng:</b> {selected.SoPhong}
            </p>

            <p>
              <b>Loại phòng:</b> {selected.TenLoai}
            </p>

            <p>
              <b>Ngày nhận:</b>{" "}
              {new Date(selected.NgayNhanPhong).toLocaleString()}
            </p>

            <p>
              <b>Ngày trả:</b>{" "}
              {new Date(selected.NgayTraPhong).toLocaleString()}
            </p>

            <p>
              <b>Tổng tiền:</b> {Number(selected.ThanhTien).toLocaleString()} đ
            </p>

            <button className="btn-danger" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

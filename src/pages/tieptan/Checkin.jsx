import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/checkinQL.css";

export default function CheckIn() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const res = await api.get("/datphong/checkin-list");

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (maPP) => {
    try {
      await api.put(`/datphong/${maPP}/check-in`);

      alert("Check-in thành công");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <div className="checkin-page">
        <div className="checkin-header">
          <h2>Check In</h2>
        </div>
      </div>

      <div className="checkin-table">
        <div className="checkin-table-header">
          <span>Mã ĐP</span>
          <span>Khách hàng</span>
          <span>Phòng</span>
          <span>Ngày nhận</span>
          <span>Loại đặt</span>
          <span>Hành động</span>
        </div>

        {data.map((row) => (
          <div className="checkin-table-row" key={row.MaPP}>
            <span>{row.MaDP}</span>

            <span>{row.HoTenKH}</span>

            <span>{row.SoPhong}</span>
            <span>{row.LoaiDat}</span>
            <span>{new Date(row.NgayNhanPhong).toLocaleString()}</span>

            <span>
              <button className="btn" onClick={() => handleCheckIn(row.MaPP)}>
                Check In
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

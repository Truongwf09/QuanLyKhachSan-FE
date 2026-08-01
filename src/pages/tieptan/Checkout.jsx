import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/checkoutQL.css";

export default function CheckOut() {
  const [data, setData] = useState([]);
  const [now, setNow] = useState(Date.now());

  const loadData = async () => {
    try {
      const res = await api.get("/datphong/checkout-list");

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getLateSurcharge = (row) => {
    const lateMs = now - new Date(row.NgayTraPhong).getTime();
    const extraHours = Math.max(0, Math.ceil(lateMs / (60 * 60 * 1000)));
    return {
      extraHours,
      amount: extraHours * Number(row.GiaTheoGio || 0),
    };
  };

  const handleCheckOut = async (maPP, HoTenKH, SoPhong, surcharge) => {
    const surchargeNote =
      surcharge.amount > 0
        ? `\n\nPhụ thu checkout trễ: ${surcharge.extraHours} giờ × ${Number(surcharge.amount / surcharge.extraHours).toLocaleString("vi-VN")}đ = ${Number(surcharge.amount).toLocaleString("vi-VN")}đ.`
        : "";
    const ok = window.confirm(
      `Bạn có chắc chắn khách "${HoTenKH}" (Phòng ${SoPhong}) đã trả phòng không?${surchargeNote}\n\nSau khi xác nhận, hệ thống sẽ:\n- Hoàn tất check-out\n- Tạo yêu cầu dọn phòng\n- Không thể hoàn tác.`,
    );
    if (!ok) return;

    try {
      const res = await api.put(`/datphong/${maPP}/check-out`);

      const surcharge = res.data?.surcharge;
      alert(
        surcharge?.amount > 0
          ? `Check-out trễ ${surcharge.extraHours} giờ. Phụ thu: ${Number(surcharge.amount).toLocaleString("vi-VN")}đ.`
          : "Check-out thành công",
      );

      loadData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <div className="checkout-header">
        <div className="checkout-header">
          <h2>💳 Check Out</h2>
        </div>
      </div>

      <div className="checkout-table">
        <div className="checkout-table-header">
          <span>Mã ĐP</span>
          <span>Khách hàng</span>
          <span>Phòng</span>
          <span>Check In</span>
          <span>Ngày trả</span>
          <span>Hành động</span>
        </div>

        {data.map((row) => {
          const surcharge = getLateSurcharge(row);

          return (
            <div className="checkout-table-row" key={row.MaPP}>
              <span>{row.MaDP}</span>

              <span>{row.HoTenKH}</span>

              <span>{row.SoPhong}</span>

              <span>{new Date(row.NgayCheckIn).toLocaleString()}</span>

              <span>{new Date(row.NgayTraPhong).toLocaleString()}</span>

              <span>
                <button
                  className="btn-danger"
                  onClick={() =>
                    handleCheckOut(
                      row.MaPP,
                      row.HoTenKH,
                      row.SoPhong,
                      surcharge,
                    )
                  }
                >
                  Check Out
                </button>

                {surcharge.amount > 0 && (
                  <small
                    style={{ display: "block", marginTop: 6, color: "#b45309" }}
                  >
                    Phụ thu: trễ {surcharge.extraHours} giờ ·{" "}
                    {Number(surcharge.amount).toLocaleString("vi-VN")}đ
                  </small>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

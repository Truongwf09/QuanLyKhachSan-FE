import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/DashboardLT.css";

export default function DashboardLT() {
  const [loading, setLoading] = useState(true);

  const [rooms, setRooms] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [invoices, setInvoices] = useState([]);

  const [stats, setStats] = useState({
    occupied: 0,
    total: 0,
    bookingToday: 0,
    checkinToday: 0,
    revenue: 0,
  });

  const today = new Date();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [roomRes, bookingRes, invoiceRes] = await Promise.all([
        api.get("/phong"),
        api.get("/datphong"),
        api.get("/hoadon"),
      ]);

      const roomData = roomRes.data || [];
      const bookingData = bookingRes.data || [];
      const invoiceData = invoiceRes.data || [];

      setRooms(roomData);
      setBookings(bookingData);
      setInvoices(invoiceData);

      calculateDashboard(roomData, bookingData, invoiceData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const calculateDashboard = (roomData, bookingData, invoiceData) => {
    const totalRoom = roomData.length;

    const occupied = roomData.filter(
      (x) => x.TinhTrangPhong === "đang sử dụng",
    ).length;

    const todayStr = new Date().toISOString().slice(0, 10);

    const bookingToday = bookingData.filter((x) => {
      if (!x.NgayDat) return false;

      return x.NgayDat.slice(0, 10) === todayStr;
    }).length;

    const checkinToday = bookingData.filter((x) => {
      if (!x.NgayNhanPhong) return false;

      return x.NgayNhanPhong.slice(0, 10) === todayStr;
    }).length;

    const revenue = invoiceData

      .filter((x) => {
        if (x.TrangThai !== "đã thanh toán") return false;

        if (!x.NgayThanhToan) return false;

        const d = new Date(x.NgayThanhToan);

        return (
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })

      .reduce(
        (sum, item) => sum + Number(item.ThanhTien),

        0,
      );

    setStats({
      occupied,

      total: totalRoom,

      bookingToday,

      checkinToday,

      revenue,
    });
  };
  const progress = stats.total === 0 ? 0 : (stats.occupied / stats.total) * 100;

  const formatMoney = (money) => {
    if (money >= 1000000) {
      return (money / 1000000).toFixed(1) + "M";
    }

    return Number(money).toLocaleString("vi-VN");
  };

  const checkinList = bookings.filter((item) => {
    if (!item.NgayNhanPhong) return false;

    return (
      item.NgayNhanPhong.slice(0, 10) === new Date().toISOString().slice(0, 10)
    );
  });

  const checkoutList = bookings.filter((item) => {
    if (!item.NgayTraPhong) return false;

    return (
      item.NgayTraPhong.slice(0, 10) === new Date().toISOString().slice(0, 10)
    );
  });

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}

      {/* <div className="dashboard-top">

        <div>

            <h2>

                Dashboard – Tổng quan chi nhánh

            </h2>

        </div>

        <div className="staff-box">

            <div className="avatar">

                LT

            </div>

            <span>

                Lễ Tân

            </span>

        </div>

    </div> */}

      {/* CARD */}

      <div className="card-grid">
        <div className="card-item">
          <div className="card-title">Phòng đang có khách</div>

          <div className="card-number blue">{stats.occupied}</div>

          <div className="card-sub">/ {stats.total} phòng tổng</div>

          <div className="progress">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="card-item">
          <div className="card-title">Booking hôm nay</div>

          <div className="card-number green">{stats.bookingToday}</div>

          <div className="card-sub">
            {bookings.filter((x) => x.TrangThai === "chưa xác nhận").length} chờ
            xác nhận
          </div>
        </div>

        <div className="card-item">
          <div className="card-title">Nhận phòng hôm nay</div>

          <div className="card-number orange">{stats.checkinToday}</div>

          <div className="card-sub">Dự kiến 14:00–18:00</div>
        </div>

        <div className="card-item">
          <div className="card-title">Doanh thu tháng này</div>

          <div className="card-number blue">{formatMoney(stats.revenue)}</div>

          <div className="card-sub">Doanh thu đã thanh toán</div>
        </div>
      </div>
      {/* ============================= */}
      {/* CHECK IN - CHECK OUT */}
      {/* ============================= */}

      <div className="dashboard-content">
        {/* CHECK IN */}

        <div className="schedule-card">
          <div className="schedule-header">
            <div>
              <h3>Nhận phòng hôm nay</h3>
              <p>{checkinList.length} lượt nhận phòng</p>
            </div>

            <button>Xem tất cả</button>
          </div>

          <div className="schedule-body">
            {checkinList.length === 0 && (
              <div className="empty-card">Không có lịch nhận phòng</div>
            )}

            {checkinList.slice(0, 5).map((item) => (
              <div key={item.MaDP} className="schedule-item">
                <div className="schedule-avatar">{item.HoTenKH?.charAt(0)}</div>

                <div className="schedule-info">
                  <b>{item.HoTenKH}</b>

                  <span>Phòng {item.SoPhong}</span>
                </div>

                <div className="schedule-time">
                  {new Date(item.NgayNhanPhong).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHECK OUT */}

        <div className="schedule-card">
          <div className="schedule-header">
            <div>
              <h3>Trả phòng hôm nay</h3>

              <p>{checkoutList.length} lượt trả phòng</p>
            </div>

            <button>Xem tất cả</button>
          </div>

          <div className="schedule-body">
            {checkoutList.length === 0 && (
              <div className="empty-card">Không có lịch trả phòng</div>
            )}

            {checkoutList.slice(0, 5).map((item) => (
              <div key={item.MaDP} className="schedule-item">
                <div className="schedule-avatar green">
                  {item.HoTenKH?.charAt(0)}
                </div>

                <div className="schedule-info">
                  <b>{item.HoTenKH}</b>

                  <span>Phòng {item.SoPhong}</span>
                </div>

                <div
                  className={
                    item.TrangThaiHoaDon === "đã thanh toán"
                      ? "mini-badge success"
                      : "mini-badge danger"
                  }
                >
                  {item.TrangThaiHoaDon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* TRẠNG THÁI PHÒNG */}
      {/* ===================================== */}

      <div className="room-section">
        <div className="panel-header">
          <h3>Trạng thái phòng</h3>

          <div className="legend">
            <span>
              <i
                className="dot"
                style={{
                  background: "#dcfce7",
                }}
              />
              Có sẵn
            </span>

            <span>
              <i
                className="dot"
                style={{
                  background: "#fee2e2",
                }}
              />
              Đang sử dụng
            </span>

            <span>
              <i
                className="dot"
                style={{
                  background: "#fef3c7",
                }}
              />
              Đang dọn
            </span>

            <span>
              <i
                className="dot"
                style={{
                  background: "#e5e7eb",
                }}
              />
              Bảo trì
            </span>
          </div>
        </div>

        <div className="room-grid">
          {rooms.map((room) => {
            let color = "#f8fafc";

            switch (room.TinhTrangPhong) {
              case "có sẵn":
                color = "#dcfce7";
                break;

              case "đang sử dụng":
                color = "#fee2e2";
                break;

              case "đang dọn dẹp":
                color = "#fef3c7";
                break;

              case "bảo trì":
                color = "#e5e7eb";
                break;

              default:
                color = "#f8fafc";
            }

            return (
              <div
                key={room.MaPhong}
                className="room-box"
                style={{
                  background: color,
                }}
              >
                <div className="room-number">{room.SoPhong}</div>

                <div className="room-type">{room.TenLoai}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

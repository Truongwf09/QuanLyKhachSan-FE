import { useEffect, useMemo, useState } from "react";
import { getRooms, getLoaiPhong } from "../../services/api";
import "../../styles/admin.css";
import "../../styles/dashboardQL.css";

// Map trạng thái phòng -> màu hiển thị (đồng bộ với Rooms.jsx)
const STATUS_LIST = [
  { key: "có sẵn", label: "Có sẵn", color: "#81fbac" },
  { key: "đang sử dụng", label: "Đang sử dụng", color: "#ffa2a2" },
  { key: "đang dọn dẹp", label: "Đang dọn dẹp", color: "#ffea96" },
  { key: "bảo trì", label: "Bảo trì", color: "#b8b9bc" },
];

export default function DashboardQL() {
  const [data, setData] = useState([]);
  const [loaiPhong, setLoaiPhong] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend đã tự lọc phòng theo chi nhánh dựa vào token, nên FE chỉ cần gọi thẳng.
  const loadData = async () => {
    try {
      setLoading(true);
      const [rooms, loai] = await Promise.all([getRooms(), getLoaiPhong()]);

      setData(rooms);
      setLoaiPhong(loai);
    } catch (err) {
      console.error("Lỗi load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============ TÍNH TOÁN THỐNG KÊ ============
  const stats = useMemo(() => {
    const total = data.length;
    const counts = STATUS_LIST.reduce((acc, s) => {
      acc[s.key] = data.filter((r) => r.TinhTrangPhong === s.key).length;
      return acc;
    }, {});
    return { total, counts };
  }, [data]);

  // Số phòng theo tầng (cho biểu đồ cột)
  const byFloor = useMemo(() => {
    const map = {};
    data.forEach((r) => {
      const tang = r.Tang || "Khác";
      map[tang] = (map[tang] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) =>
        String(a[0]).localeCompare(String(b[0]), "vi", { numeric: true }),
      )
      .map(([tang, soLuong]) => ({ tang, soLuong }));
  }, [data]);

  const maxFloorCount = Math.max(1, ...byFloor.map((f) => f.soLuong));

  // ============ BIỂU ĐỒ TRÒN (SVG thuần) ============
  const pieSlices = useMemo(() => {
    const total = stats.total || 1;
    let cumulative = 0;
    return STATUS_LIST.map((s) => {
      const value = stats.counts[s.key] || 0;
      const fraction = value / total;
      const startAngle = cumulative * 360;
      cumulative += fraction;
      const endAngle = cumulative * 360;
      return { ...s, value, fraction, startAngle, endAngle };
    });
  }, [stats]);

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    // Vòng tròn đầy đủ (100%) thì vẽ riêng để tránh lỗi arc 360 độ
    if (endAngle - startAngle >= 359.999) {
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="db-page">
      <div className="db-title">
        <h2>Thống kê chi nhánh</h2>

        <p>Tổng quan tình trạng phòng của chi nhánh</p>
      </div>

      {loading ? (
        <p style={{ padding: 20 }}>Đang tải dữ liệu...</p>
      ) : data.length === 0 ? (
        <p style={{ padding: 20 }}>Không có dữ liệu phòng</p>
      ) : (
        <>
          {/* ===== CARD TỔNG QUAN ===== */}
          <div className="db-grid">
            <div className="db-card total">
              <div className="db-icon">🏨</div>

              <div className="db-number">{stats.total}</div>

              <div className="db-label">Tổng số phòng</div>

              <div className="db-sub">Phòng thuộc chi nhánh</div>
            </div>

            {STATUS_LIST.map((s) => (
              <div className="db-card room" key={s.key}>
                <div
                  className="db-icon"
                  style={{
                    background: s.color,
                    color: "#fff",
                  }}
                >
                  🛏️
                </div>

                <div className="db-number">{stats.counts[s.key]}</div>

                <div className="db-label">{s.label}</div>

                <div className="db-sub">Trạng thái phòng</div>
              </div>
            ))}
          </div>

          {/* ===== BIỂU ĐỒ ===== */}
          <div className="db-row">
            {/* Pie chart trạng thái phòng */}
            <div className="db-chart">
              <div className="db-chart-title">
                <h3>Tình trạng phòng</h3>

                <span>Realtime</span>
              </div>

              <div className="db-pie">
                <svg viewBox="0 0 200 200" width="200" height="200">
                  {pieSlices
                    .filter((s) => s.value > 0)
                    .map((s) => (
                      <path
                        key={s.key}
                        d={describeArc(100, 100, 90, s.startAngle, s.endAngle)}
                        fill={s.color}
                        stroke="#1e1e1e"
                        strokeWidth="0.2"
                      />
                    ))}
                  <circle
                    cx="100"
                    cy="100"
                    r="50"
                    fill="var(--bg-card, #fff)"
                  />
                </svg>

                <div className="db-legend">
                  {STATUS_LIST.map((s) => (
                    <div className="db-legend-item" key={s.key}>
                      <span
                        className="db-dot"
                        style={{ backgroundColor: s.color }}
                      />
                      <span>
                        {s.label}: <b>{stats.counts[s.key] || 0}</b> (
                        {stats.total
                          ? Math.round(
                              ((stats.counts[s.key] || 0) / stats.total) * 100,
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart số phòng theo tầng */}
            <div className="db-chart">
              <div className="db-chart-title">
                <h3>Số phòng theo tầng</h3>
                <span>Realtime</span>
              </div>

              <div className="db-progress-card">
                {byFloor.map((f) => (
                  <div className="db-progress-item" key={f.tang}>
                    <div className="db-progress-head">
                      <span>Tầng {f.tang}</span>
                      <span>{f.soLuong}</span>
                    </div>
                    <div className="db-progress">
                      <div
                        className="db-progress-fill"
                        style={{
                          width: `${(f.soLuong / maxFloorCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="bar-value">{f.soLuong}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== BẢNG CHI TIẾT THEO LOẠI PHÒNG ===== */}
          {/* <div className="table-nv">
            <div className="table-header">
              <span>Mã loại</span>
              <span>Tên loại</span>
              <span>Số phòng</span>
              <span colSpan={2}></span>
            </div>

            {loaiPhong.map((lp) => {
              const soLuong = data.filter((r) => r.MaLoai === lp.MaLoai).length;
              return (
                <div className="table-row" key={lp.MaLoai}>
                  <span>{lp.MaLoai}</span>
                  <span>{lp.TenLoai}</span>
                  <span>{soLuong}</span>
                  <span></span>
                  <span></span>
                </div>
              );
            })}
          </div> */}
        </>
      )}
    </div>
  );
}

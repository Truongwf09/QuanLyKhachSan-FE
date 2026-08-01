import { useEffect, useState, useRef } from "react";

import { API_URL } from "../../services/backend";

const BASE = API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Dashboard() {
  const [stats, setStats] = useState({
    tongPhong: 0,
    phongTrong: 0,
    phongDangDung: 0,
    phongDonDep: 0,
    phongBaoTri: 0,
    tongNhanVien: 0,
    tongChiNhanh: 0,
    datPhongHomNay: 0,
    doanhThuThang: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [branchStats, setBranchStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const revenueRef = useRef(null);
  const donutRef = useRef(null);
  const revenueChart = useRef(null);
  const donutChart = useRef(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = () => renderCharts();
      document.head.appendChild(script);
      return () => document.head.removeChild(script);
    }
  }, [loading, chartData]);

  const getLast6Months = () => {
    const result = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      result.push({
        key,
        label: `T${d.getMonth() + 1}`,
      });
    }

    return result;
  };

  const loadDashboard = async () => {
    try {
      const headers = getHeaders();
      const [phongRes, nhanvienRes, chinhanhRes, datphongRes, hoadonRes] =
        await Promise.all([
          fetch(`${BASE}/phong`, { headers }),
          fetch(`${BASE}/nhanvien`, { headers }),
          fetch(`${BASE}/chinhanh`, { headers }),
          fetch(`${BASE}/datphong`, { headers }),
          fetch(`${BASE}/hoadon`, { headers }),
        ]);

      const phong = await phongRes.json();
      const nhanvien = await nhanvienRes.json();
      const chinhanh = await chinhanhRes.json();
      const datphong = await datphongRes.json();
      const hoadon = await hoadonRes.json();

      const tongPhong = Array.isArray(phong) ? phong.length : 0;
      const phongTrong = Array.isArray(phong)
        ? phong.filter((p) => p.TinhTrangPhong === "có sẵn").length
        : 0;
      const phongDangDung = Array.isArray(phong)
        ? phong.filter((p) => p.TinhTrangPhong === "đang sử dụng").length
        : 0;
      const phongDonDep = Array.isArray(phong)
        ? phong.filter((p) => p.TinhTrangPhong === "đang dọn dẹp").length
        : 0;
      const phongBaoTri = Array.isArray(phong)
        ? phong.filter((p) => p.TinhTrangPhong === "bảo trì").length
        : 0;

      const today = new Date().toISOString().slice(0, 10);
      const datPhongHomNay = Array.isArray(datphong)
        ? datphong.filter(
            (d) => (d.NgayDat || d.NgayNhanPhong || "").slice(0, 10) === today,
          ).length
        : 0;

      const thangNay = new Date().toISOString().slice(0, 7);
      const doanhThuThang = Array.isArray(hoadon)
        ? hoadon
            .filter(
              (h) =>
                h.TrangThai === "đã thanh toán" &&
                (h.NgayThanhToan || "").slice(0, 7).slice(0, 7) === thangNay,
            )
            .reduce((sum, h) => sum + Number(h.ThanhTien || 0), 0)
        : 0;

      const thangList = getLast6Months();
      const chartArr = thangList.map(({ label, key }) => ({
        thang: label,
        doanhThu: Array.isArray(hoadon)
          ? Number(
              (
                hoadon
                  .filter((h) => {
                    if (h.TrangThai !== "đã thanh toán") return false;

                    const d = new Date(h.NgayThanhToan);

                    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

                    return monthKey === key;
                  })
                  .reduce((sum, h) => sum + Number(h.ThanhTien || 0), 0) /
                1000000
              ).toFixed(1),
            )
          : 0,
      }));
      console.table(chartArr);
      const branchArr = Array.isArray(chinhanh)
        ? chinhanh.map((cn) => {
            const total = Array.isArray(phong)
              ? phong.filter((p) => p.MaCN === cn.MaCN).length
              : 0;
            const occupied = Array.isArray(phong)
              ? phong.filter(
                  (p) =>
                    p.MaCN === cn.MaCN && p.TinhTrangPhong === "đang sử dụng",
                ).length
              : 0;
            return {
              ten: cn.TenCN,
              phanTram: total > 0 ? Math.round((occupied / total) * 100) : 0,
            };
          })
        : [];

      const recent = Array.isArray(datphong)
        ? [...datphong]
            .sort((a, b) => new Date(b.NgayDat || 0) - new Date(a.NgayDat || 0))
            .slice(0, 5)
        : [];

      setStats({
        tongPhong,
        phongTrong,
        phongDangDung,
        phongDonDep,
        phongBaoTri,
        tongNhanVien: Array.isArray(nhanvien) ? nhanvien.length : 0,
        tongChiNhanh: Array.isArray(chinhanh) ? chinhanh.length : 0,
        datPhongHomNay,
        doanhThuThang,
      });
      setChartData(chartArr);
      setBranchStats(branchArr);
      setRecentBookings(recent);
    } catch (err) {
      console.error("❌ Lỗi load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!window.Chart) return;
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#aaa" : "#6b7280";

    if (revenueRef.current) {
      if (revenueChart.current) revenueChart.current.destroy();
      revenueChart.current = new window.Chart(revenueRef.current, {
        type: "bar",
        data: {
          labels: chartData.map((d) => d.thang),
          datasets: [
            {
              label: "Doanh thu (triệu ₫)",
              data: chartData.map((d) => d.doanhThu),
              backgroundColor: "#3266ad",
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => c.parsed.y + "M ₫" } },
          },
          scales: {
            x: {
              ticks: { color: textColor, font: { size: 12 } },
              grid: { display: false },
              border: { display: false },
            },
            y: {
              ticks: {
                color: textColor,
                font: { size: 11 },
                callback: (v) => v + "M",
              },
              grid: { color: gridColor },
              border: { display: false },
            },
          },
        },
      });
    }

    if (donutRef.current) {
      if (donutChart.current) donutChart.current.destroy();
      donutChart.current = new window.Chart(donutRef.current, {
        type: "doughnut",
        data: {
          labels: ["Có sẵn", "Đang dùng", "Dọn dẹp", "Bảo trì"],
          datasets: [
            {
              data: [
                stats.phongTrong,
                stats.phongDangDung,
                stats.phongDonDep,
                stats.phongBaoTri,
              ],
              backgroundColor: ["#2d7a3a", "#3266ad", "#d97706", "#73726c"],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (c) => c.label + ": " + c.parsed + " phòng" },
            },
          },
        },
      });
    }
  };

  const formatMoney = (num) =>
    num >= 1_000_000
      ? (num / 1_000_000).toFixed(1) + "M ₫"
      : num.toLocaleString("vi-VN") + " ₫";

  const statusBadge = (trangThai) => {
    const map = {
      "đã xác nhận": {
        text: "Đã xác nhận",
        cls: "badge-success",
      },

      "đã giữ phòng": {
        text: "Đã giữ phòng",
        cls: "badge-warning",
      },

      "đã nhận phòng": {
        text: "Đã nhận phòng",
        cls: "badge-success",
      },

      "đã hủy": {
        text: "Đã hủy",
        cls: "badge-danger",
      },

      "hoàn thành": {
        text: "Hoàn thành",
        cls: "badge-success",
      },
    };
    return (
      map[String(trangThai).toLowerCase()] || {
        text: trangThai || "—",
        cls: "badge-warning",
      }
    );
  };

  if (loading)
    return (
      <div style={{ padding: 32, color: "var(--color-text-secondary)" }}>
        Đang tải dữ liệu...
      </div>
    );

  return (
    <>
      <style>{`
        .db-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 18px; }
        .db-card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
        .db-card-icon { width: 36px; height: 36px; border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .db-card-val { font-size: 22px; font-weight: 500; color: var(--color-text-primary); }
        .db-card-label { font-size: 12px; color: var(--color-text-secondary); }
        .db-card-sub { font-size: 11px; color: var(--color-text-secondary); display: flex; align-items: center; gap: 3px; }
        .db-section { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 18px 20px; }
        .db-section h3 { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 14px; }
        .db-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .db-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 10px; font-size: 12px; color: var(--color-text-secondary); }
        .db-legend span { display: flex; align-items: center; gap: 5px; }
        .db-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
        .avail-bar { height: 6px; border-radius: 3px; background: var(--color-border-tertiary); margin-top: 5px; overflow: hidden; }
        .avail-fill { height: 100%; border-radius: 3px; background: #3266ad; }
        .bk-table { width: 100%; font-size: 13px; border-collapse: collapse; }
        .bk-table th { font-weight: 500; color: var(--color-text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; padding: 0 8px 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); text-align: left; }
        .bk-table td { padding: 10px 8px 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); color: var(--color-text-primary); }
        .bk-table tr:last-child td { border-bottom: none; }
        .badge-success { background: var(--color-background-success); color: var(--color-text-success); }
        .badge-warning { background: var(--color-background-warning); color: var(--color-text-warning); }
        .badge-danger  { background: var(--color-background-danger);  color: var(--color-text-danger); }
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
      `}</style>

      <div className="dashboard">
        {/* <div className="dashboard-title" >
          <h2>
            Dashboard
          </h2>
        </div> */}

        {/* STAT CARDS */}
        <div className="db-grid">
          <div className="db-card">
            <div className="db-card-icon" style={{ background: "#e8f0fe" }}>
              📍
            </div>
            <div className="db-card-val">{stats.tongChiNhanh}</div>
            <div className="db-card-label">Tổng chi nhánh</div>
            <div className="db-card-sub" style={{ color: "green" }}>
              ✓ Đang hoạt động
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-icon" style={{ background: "#e6f4ea" }}>
              🏨
            </div>
            <div className="db-card-val">{stats.tongPhong}</div>
            <div className="db-card-label">Tổng số phòng</div>
            <div className="db-card-sub" style={{ color: "green" }}>
              ✓ {stats.phongTrong} phòng trống
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-icon" style={{ background: "#fef3e2" }}>
              📅
            </div>
            <div className="db-card-val">{stats.datPhongHomNay}</div>
            <div className="db-card-label">Đặt phòng hôm nay</div>
            <div className="db-card-sub" style={{ color: "green" }}>
              🕐 Cập nhật mới nhất
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-icon" style={{ background: "#f3e8ff" }}>
              👨‍💼
            </div>
            <div className="db-card-val">{stats.tongNhanVien}</div>
            <div className="db-card-label">Tổng nhân viên</div>
            <div className="db-card-sub" style={{ color: "green" }}>
              🏢 Toàn hệ thống
            </div>
          </div>
          <div className="db-card">
            <div className="db-card-icon" style={{ background: "#fce7f3" }}>
              💰
            </div>
            <div className="db-card-val">
              {formatMoney(stats.doanhThuThang)}
            </div>
            <div className="db-card-label">Doanh thu tháng này</div>
            <div className="db-card-sub" style={{ color: "green" }}>
              ↑ Tính từ đầu tháng
            </div>
          </div>
        </div>

        {/* BIỂU ĐỒ DOANH THU */}
        <div className="db-section" style={{ marginBottom: 14 }}>
          <h3>Doanh thu 6 tháng gần nhất</h3>
          <div className="db-legend">
            <span>
              <span
                className="db-legend-dot"
                style={{ background: "#3266ad" }}
              />
              Doanh thu (triệu ₫)
            </span>
          </div>
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={revenueRef} />
          </div>
        </div>

        {/* DONUT + CÔNG SUẤT */}
        <div className="db-row">
          <div className="db-section">
            <h3>Tình trạng phòng</h3>
            <div className="db-legend">
              <span>
                <span
                  className="db-legend-dot"
                  style={{ background: "#2d7a3a" }}
                />
                Có sẵn
              </span>
              <span>
                <span
                  className="db-legend-dot"
                  style={{ background: "#3266ad" }}
                />
                Đang dùng
              </span>
              <span>
                <span
                  className="db-legend-dot"
                  style={{ background: "#d97706" }}
                />
                Dọn dẹp
              </span>
              <span>
                <span
                  className="db-legend-dot"
                  style={{ background: "#73726c" }}
                />
                Bảo trì
              </span>
            </div>
            <div style={{ position: "relative", width: "100%", height: 180 }}>
              <canvas ref={donutRef} />
            </div>
          </div>

          <div className="db-section">
            <h3>Công suất theo chi nhánh</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 4,
              }}
            >
              {branchStats.length === 0 ? (
                <p
                  style={{ color: "var(--color-text-secondary)", fontSize: 13 }}
                >
                  Chưa có dữ liệu
                </p>
              ) : (
                branchStats.map((b, index) => (
                  <div key={`${b.ten}-${index}`}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <span>{b.ten}</span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {b.phanTram}%
                      </span>
                    </div>
                    <div className="avail-bar">
                      <div
                        className="avail-fill"
                        style={{ width: `${b.phanTram}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* BẢNG ĐẶT PHÒNG GẦN ĐÂY */}
        <div className="db-section">
          <h3>Đặt phòng gần đây</h3>
          {recentBookings.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
              Chưa có dữ liệu đặt phòng
            </p>
          ) : (
            <table className="bk-table">
              <thead>
                <tr>
                  <th>Mã đặt phòng</th>
                  <th>Khách hàng</th>
                  <th>Phòng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((dp) => {
                  const badge = statusBadge(dp.TrangThai);
                  return (
                    <tr key={dp.MaDP}>
                      <td style={{ color: "var(--color-text-secondary)" }}>
                        #{dp.MaDP}
                      </td>
                      <td>{dp.HoTenKH || dp.MaKH || "—"}</td>
                      <td>{dp.SoPhong || "—"}</td>
                      <td style={{ color: "var(--color-text-secondary)" }}>
                        {dp.NgayDat ? dp.NgayDat.slice(0, 10) : "—"}
                      </td>
                      <td>
                        <span className={`status-badge ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

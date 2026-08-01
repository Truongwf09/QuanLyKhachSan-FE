import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "../../styles/HoaDonLT.css";
import InvoiceDetailModal from "../../components/InvoiceDetailModal";

export default function HoaDonLT() {
  const [loading, setLoading] = useState(true);

  const [hoaDon, setHoaDon] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    loadHoaDon();
  }, []);

  const loadHoaDon = async () => {
    try {
      setLoading(true);

      const res = await api.get("/hoadon");

      setHoaDon(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const filteredData = useMemo(() => {
    return hoaDon.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.MaHD?.toLowerCase().includes(keyword) ||
        item.HoTenKH?.toLowerCase().includes(keyword);

      const matchStatus = status === "all" || item.TrangThai === status;

      if (!item.NgayXuat) {
        return matchSearch && matchStatus;
      }

      const d = new Date(item.NgayXuat);

      const matchMonth =
        d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);

      return matchSearch && matchStatus && matchMonth;
    });
  }, [hoaDon, search, status, month, year]);

  const thongKe = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const yearData = hoaDon.filter((item) => {
      if (!item.NgayXuat) return false;

      return new Date(item.NgayXuat).getFullYear() === currentYear;
    });

    return {
      tongHoaDon: yearData.length,

      daTT: yearData.filter((x) => x.TrangThai === "đã thanh toán").length,

      chuaTT: yearData.filter((x) => x.TrangThai !== "đã thanh toán").length,

      doanhThu: yearData
        .filter((x) => x.TrangThai === "đã thanh toán")
        .reduce((sum, item) => sum + Number(item.ThanhTien), 0),
    };
  }, [hoaDon]);

  const money = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }

    return Number(value).toLocaleString("vi-VN");
  };
  const getRemainingAmount = (item) => {
    return Number(item.ConLai || 0);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  const handleView = async (maHD) => {
    try {
      const res = await api.get(`/hoadon/${maHD}`);

      setSelectedInvoice(res.data);
      setOpenDetail(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="invoice-page">
      {/* ================= HEADER ================= */}

      <div className="invoice-header">
        <div>
          <h2>Quản lý hóa đơn</h2>

          <p>Danh sách hóa đơn của chi nhánh</p>
        </div>

        <div className="invoice-action">
          <button className="btn-light">Xuất Excel</button>

          <button className="btn-primary">+ Tạo hóa đơn</button>
        </div>
      </div>

      {/* ================= CARD ================= */}

      <div className="invoice-card-grid">
        <div className="invoice-card">
          <div className="title">Tổng hóa đơn năm nay</div>

          <div className="number">{thongKe.tongHoaDon}</div>
        </div>

        <div className="invoice-card">
          <div className="title">Đã thanh toán</div>

          <div className="number green">{thongKe.daTT}</div>
        </div>

        <div className="invoice-card">
          <div className="title">Chưa thanh toán</div>

          <div className="number red">{thongKe.chuaTT}</div>
        </div>

        <div className="invoice-card">
          <div className="title">Tổng doanh thu cả năm</div>

          <div className="number blue">{money(thongKe.doanhThu)}</div>
        </div>
      </div>
      {/* ================= FILTER ================= */}

      <div className="invoice-toolbar">
        <input
          type="text"
          placeholder="Tìm mã hóa đơn, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tất cả</option>

          <option value="đã thanh toán">Đã thanh toán</option>

          <option value="chưa thanh toán">Chưa thanh toán</option>
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
      </div>
      {/* ================= TABLE ================= */}

      <div className="invoice-table-card">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Mã HD</th>

              <th>Khách hàng</th>

              <th>Chi nhánh</th>

              <th>Ngày xuất</th>

              <th>Còn phải thanh toán</th>

              <th>Trạng thái</th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {filteredData.map((item) => (
              <tr key={item.MaHD}>
                <td>
                  <b>#{item.MaHD}</b>
                </td>

                <td>{item.HoTenKH}</td>

                <td>{item.TenCN}</td>

                <td>{new Date(item.NgayXuat).toLocaleDateString("vi-VN")}</td>

                <td className="money">
                  {getRemainingAmount(item).toLocaleString("vi-VN")}đ
                </td>

                <td>
                  {item.TrangThai === "đã thanh toán" ? (
                    <span className="badge success">Đã TT</span>
                  ) : (
                    <span className="badge danger">Chưa TT</span>
                  )}
                </td>

                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleView(item.MaHD)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openDetail && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setOpenDetail(false)}
        />
      )}
    </div>
  );
}

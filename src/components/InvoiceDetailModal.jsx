import "../styles/InvoiceDetailModal.css";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function InvoiceDetailModal({ invoice, onClose }) {
  const [invoiceData, setInvoiceData] = useState(invoice);

  const [showAddService, setShowAddService] = useState(false);

  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [showCollect, setShowCollect] = useState(false);

  const [customerMoney, setCustomerMoney] = useState("");

  useEffect(() => {
    setInvoiceData(invoice);
  }, [invoice]);
  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "đ";

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

  const tamTinh = Number(invoiceData.ThanhTien || 0);
  const tienCoc = Number(invoiceData.TienDatCoc || 0);
  const tienKhachDua = Number(customerMoney || 0);
  const daThu = Number(invoiceData.SoTienDaThu || 0);
  const conLai = Number(invoiceData.ConLai || 0);
  const tienThieu = Math.max(conLai - tienKhachDua, 0);

  const tienThua = Math.max(tienKhachDua - conLai, 0);
  const daThanhToan = Number(invoiceData.TongCanThu || 0);
  const isPaid = invoiceData.TrangThai === "đã thanh toán";
  const roomBaseCharge = Math.max(
    0,
    Number(invoiceData.TongTienPhong || 0) -
      Number(invoiceData.PhuThuTraMuon || 0),
  );
  const roomDescription =
    invoiceData.LoaiDat === "theo giờ"
      ? `${invoiceData.TenLoai} x ${invoiceData.SoGio} giờ`
      : `${invoiceData.TenLoai} x ${invoiceData.LoaiDat === "qua đêm" ? 1 : Number(invoiceData.SoDem || 0)} đêm`;
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get("/dichvu/active");
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddService = async () => {
    try {
      if (!selectedService) {
        return alert("Vui lòng chọn dịch vụ");
      }

      await api.post(`/hoadon/${invoiceData.MaHD}/service`, {
        MaDV: selectedService,
        SoLuong: Number(quantity),
      });

      // Lấy lại hóa đơn mới
      const res = await api.get(`/hoadon/${invoiceData.MaHD}`);

      setInvoiceData(res.data);

      setShowAddService(false);

      setSelectedService("");

      setQuantity(1);
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Không thể thêm dịch vụ");
    }
  };
  const handleCollectMoney = async () => {
    try {
      const res = await api.post(`/hoadon/${invoiceData.MaHD}/collect`, {
        soTienNhan: Number(customerMoney),
      });

      const detail = await api.get(`/hoadon/${invoiceData.MaHD}`);
      setInvoiceData(detail.data);

      setShowCollect(false);
      setCustomerMoney("");

      if (!res.data.success) {
        alert(
          `Đã ghi nhận ${formatMoney(res.data.daThu)}. Khách còn thiếu ${formatMoney(res.data.conLai)}.`,
        );
        return;
      }

      alert(`Đã thu đủ tiền. Tiền thừa: ${formatMoney(res.data.tienThua)}`);
    } catch (err) {
      alert(err.response?.data?.message || "Thu tiền thất bại");
    }
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-modal">
        <button className="close-btn" onClick={onClose}>
          x
        </button>

        {/* HEADER */}

        <div className="invoice-header">
          <div>
            <h2>TealHaven Hotel</h2>

            <p>{invoiceData.TenCN}</p>

            <p>Địa chỉ: {invoiceData.DiaChi}</p>
          </div>

          <div className="right">
            <h3>HÓA ĐƠN DỊCH VỤ</h3>

            <p>
              Số: <b>#{invoiceData.MaHD}</b>
            </p>

            <p>
              Ngày: {new Date(invoiceData.NgayXuat).toLocaleDateString("vi-VN")}
            </p>

            <span
              className={
                invoiceData.TrangThai === "đã thanh toán" ? "paid" : "unpaid"
              }
            >
              {invoiceData.TrangThai}
            </span>
          </div>
        </div>

        <hr />

        {/* THÔNG TIN */}

        <div className="invoice-info">
          <div>
            <h4>KHÁCH HÀNG</h4>

            <p>{invoiceData.HoTenKH}</p>

            <p>CCCD: {invoiceData.CCCD}</p>

            <p>SĐT: {invoiceData.SDT}</p>
          </div>

          <div>
            <h4>THÔNG TIN LƯU TRÚ</h4>

            <p>
              Phòng {invoiceData.SoPhong}
              {" - "}
              {invoiceData.TenLoai}
            </p>

            <p>
              Nhận:{" "}
              {new Date(invoiceData.NgayNhanPhong).toLocaleDateString("vi-VN")}
            </p>

            <p>
              Trả:{" "}
              {new Date(invoiceData.NgayTraPhong).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* TIỀN PHÒNG */}

        <div className="invoice-section">
          <h4>TIỀN PHÒNG</h4>

          <div className="row">
            <span>{roomDescription}</span>

            <span>{formatMoney(roomBaseCharge)}</span>
          </div>

          {Number(invoiceData.PhuThuTraMuon || 0) > 0 && (
            <div className="row">
              <span>Phụ thu: trễ {invoiceData.SoGioTre} giờ</span>
              <span>{formatMoney(invoiceData.PhuThuTraMuon)}</span>
            </div>
          )}
        </div>

        {/* DỊCH VỤ */}

        <div className="invoice-section">
          <h4>DỊCH VỤ BỔ SUNG</h4>
          {!isPaid && (
            <button
              className="btn-add-service"
              onClick={() => setShowAddService(true)}
            >
              + Thêm dịch vụ
            </button>
          )}
          {isPaid && (
            <p style={{ color: "#16a34a", fontSize: 13 }}>
              Hóa đơn đã thanh toán — không thể chỉnh sửa.
            </p>
          )}
          {invoiceData.DichVu?.length > 0 ? (
            invoiceData.DichVu.map((item) => (
              <div key={item.MaDV} className="row">
                <span>
                  {item.TenDV}

                  {item.SoLuong > 1 && ` (${item.SoLuong})`}
                </span>

                <span>{Number(item.ThanhTien).toLocaleString("vi-VN")}đ</span>
              </div>
            ))
          ) : (
            <div className="row">
              <span>Không sử dụng dịch vụ</span>

              <span>0đ</span>
            </div>
          )}
          {showAddService && (
            <div className="service-popup">
              <div className="service-box">
                <h3>Thêm dịch vụ</h3>

                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Chọn dịch vụ</option>

                  {services.map((item) => (
                    <option key={item.MaDV} value={item.MaDV}>
                      {item.TenDV}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <div className="popup-action">
                  <button onClick={() => setShowAddService(false)}>Hủy</button>

                  <button onClick={handleAddService}>Xác nhận</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOTAL */}

        <div className="invoice-total">
          <div className="row">
            <span>Tổng hóa đơn</span>
            <span>{formatMoney(tamTinh)}</span>
          </div>

          <div className="row">
            <span>Đặt cọc</span>
            <span style={{ color: "#16a34a" }}>{formatMoney(tienCoc)}</span>
          </div>
          <div className="row">
            <span>Đã thu</span>
            <span style={{ color: "#16a34a" }}>{formatMoney(daThu)}</span>
          </div>

          {invoiceData.TrangThai === "đã thanh toán" && (
            <div className="row">
              <span>Đã thanh toán</span>
              <span style={{ color: "#16a34a" }}>
                {formatMoney(daThanhToan)}
              </span>
            </div>
          )}

          <hr />

          <div className="grand">
            <span>CÒN PHẢI THANH TOÁN</span>
            <span>{formatMoney(conLai)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <button className="btn-outline">In hóa đơn</button>

          {invoiceData.TrangThai !== "đã thanh toán" && conLai > 0 && (
            <button
              className="btn-primary"
              onClick={() => setShowCollect(true)}
            >
              Thu tiền
            </button>
          )}
        </div>
        {showCollect && (
          <div className="service-popup">
            <div className="service-box">
              <h3>Thu tiền</h3>

              <p>
                Tổng cần thu:
                <b>{formatMoney(conLai)}</b>
              </p>

              <input
                type="number"
                placeholder="Khách đưa..."
                value={customerMoney}
                onChange={(e) => setCustomerMoney(e.target.value)}
              />

              {tienKhachDua > 0 && (
                <>
                  {tienThieu > 0 ? (
                    <p style={{ color: "red" }}>
                      Còn thiếu
                      {formatMoney(tienThieu)}
                    </p>
                  ) : (
                    <p style={{ color: "green" }}>
                      Tiền thừa:
                      {formatMoney(tienThua)}
                    </p>
                  )}
                </>
              )}

              <div className="popup-action">
                <button
                  onClick={() => {
                    setShowCollect(false);
                    setCustomerMoney("");
                  }}
                >
                  Hủy
                </button>

                <button onClick={handleCollectMoney}>Xác nhận</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

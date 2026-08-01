export default function BookingSummary({
  chiNhanh,
  form,
  currentLoaiPhong,
  currentRoom,
  soDem,
  selectedServices,
  tongTien,
}) {
  return (
    <div className="left-panel">
      <div className="booking-info">
        <h3 style={{ marginBottom: "20px", color: "#0d1b2a" }}>
          Tổng quan hóa đơn
        </h3>

        <div className="info-box">
          <span>Chi nhánh:</span>
          <strong>
            {chiNhanh.find((cn) => cn.MaCN === form.MaCN)?.TenCN || "---"}
          </strong>
        </div>
        <div className="info-box">
          <span>Loại phòng:</span>
          <strong>{currentLoaiPhong?.TenLoai || "---"}</strong>
        </div>
        <div className="info-box">
          <span>Số phòng:</span>
          <strong>
            {currentRoom ? `Phòng ${currentRoom.SoPhong}` : "---"}
          </strong>
        </div>
        <div className="info-box">
          <span>Hình thức / Thời gian:</span>
          <strong>
            {form.LoaiDat === "theo ngày"
              ? `${soDem} đêm`
              : form.LoaiDat === "theo giờ"
                ? `${form.SoGio} giờ`
                : "Qua đêm"}
          </strong>
        </div>
        <div className="info-box">
          <span>Dịch vụ thêm:</span>
          <strong style={{ fontSize: "14px" }}>
            {selectedServices.length
              ? selectedServices.map((dv) => dv.TenDV).join(", ")
              : "Không có"}
          </strong>
        </div>
        <hr
          style={{
            border: "0",
            borderTop: "1px dashed #dbe6f3",
            margin: "15px 0",
          }}
        />
        <div className="info-box">
          <span>Tạm tính thành tiền:</span>
          <strong style={{ color: "#4a90ff", fontSize: "20px" }}>
            {tongTien ? Number(tongTien).toLocaleString("vi-VN") : 0} VNĐ
          </strong>
        </div>
      </div>
    </div>
  );
}

export default function Step3_DichVuThem({
  form,
  dichVuList,
  selectedServices,
  toggleService,
  currentRoom,
}) {
  return (
    <>
      <h3 style={{ marginBottom: "20px" }}>
        Bước 3: Chọn dịch vụ đi kèm bổ sung
      </h3>

      {form.MaCN && dichVuList.length > 0 ? (
        <div className="service-grid-kh">
          {dichVuList.map((dv) => {
            const isChecked = selectedServices.some(
              (item) => item.MaDV === dv.MaDV,
            );
            return (
              <div
                key={dv.MaDV}
                className={`service-item ${isChecked ? "active" : ""}`}
                onClick={() => toggleService(dv)}
              >
                <input type="checkbox" checked={isChecked} readOnly />
                <div>
                  <strong>{dv.TenDV}</strong>
                  <p>{Number(dv.GiaDV || 0).toLocaleString("vi-VN")} VNĐ</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: "#64748b" }}>
          Chi nhánh hiện tại không hỗ trợ dịch vụ đặt trước hoặc chưa tải được
          dữ liệu.
        </p>
      )}
    </>
  );
}

import Select from "react-select";

export default function Step1_ChonPhong({
  form,
  setForm,
  chiNhanh,
  loaiPhong,
  availableRooms,
  errors,
  setErrors,
}) {
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      height: 64,
      borderRadius: 18,
      borderColor: state.isFocused ? "#4a90ff" : "#dbe6f3",
      fontSize: "17px",
    }),
  };

  return (
    <>
      <h3 style={{ marginBottom: "20px" }}>Bước 1: Chọn Phòng Muốn Đặt</h3>

      <div style={{ marginBottom: "15px" }}>
        <label>Chi nhánh</label>
        <Select
          options={chiNhanh.map((cn) => ({ value: cn.MaCN, label: cn.TenCN }))}
          value={
            chiNhanh
              .map((cn) => ({ value: cn.MaCN, label: cn.TenCN }))
              .find((i) => i.value === form.MaCN) || null
          }
          placeholder="Chọn chi nhánh"
          styles={selectStyles}
          onChange={(opt) => {
            setForm({
              ...form,
              MaCN: opt?.value || "",
              MaLoai: "",
              MaPhong: "",
            });
            setErrors({ ...errors, MaCN: "" });
          }}
        />
        {errors.MaCN && <p className="field-error">{errors.MaCN}</p>}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Loại phòng</label>
        <Select
          options={loaiPhong.map((lp) => ({
            value: lp.MaLoai,
            label: lp.TenLoai,
          }))}
          value={
            loaiPhong
              .map((lp) => ({ value: lp.MaLoai, label: lp.TenLoai }))
              .find((i) => i.value === form.MaLoai) || null
          }
          placeholder="Chọn loại phòng"
          styles={selectStyles}
          onChange={(opt) => {
            setForm({ ...form, MaLoai: opt?.value || "", MaPhong: "" });
            setErrors({ ...errors, MaLoai: "" });
          }}
        />
        {errors.MaLoai && <p className="field-error">{errors.MaLoai}</p>}
      </div>

      {form.MaLoai && (
        <div style={{ marginBottom: "15px" }}>
          <label>Số phòng trống cụ thể</label>
          <Select
            options={availableRooms.map((r) => ({
              value: r.MaPhong,
              label: `Phòng ${r.SoPhong} - Tầng ${r.Tang || 1}`,
            }))}
            value={
              availableRooms
                .map((r) => ({ value: r.MaPhong, label: `Phòng ${r.SoPhong}` }))
                .find((i) => i.value === form.MaPhong) || null
            }
            placeholder="Chọn một phòng trống"
            styles={selectStyles}
            onChange={(opt) => {
              setForm({ ...form, MaPhong: opt?.value || "" });
              setErrors({ ...errors, MaPhong: "" });
            }}
          />
          {errors.MaPhong && <p className="field-error">{errors.MaPhong}</p>}
          {availableRooms.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
              * Đang tải danh sách phòng trống hoặc loại phòng này hiện hết
              phòng.
            </p>
          )}
        </div>
      )}
    </>
  );
}

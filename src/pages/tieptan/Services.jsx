import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/servicesQL.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    try {
      const res = await api.get("/dichvu/active");

      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div className="service-page">
        <div className="service-header">
          <h2>Danh sách dịch vụ</h2>
        </div>

        <div className="services-table">
          <div className="service-table-header">
            <span>Mã DV</span>
            <span>Tên dịch vụ</span>
            <span>Giá</span>
            <span>Mô tả</span>
            <span>Hành động</span>
          </div>

          {services.length > 0 ? (
            services.map((item) => (
              <div key={item.MaDV} className="service-table-row">
                <span>{item.MaDV}</span>

                <span>{item.TenDV}</span>

                <span>{Number(item.GiaDV).toLocaleString()} đ</span>

                <span>{item.MoTa}</span>

                <span>
                  <button className="btn" onClick={() => setSelected(item)}>
                    Chi tiết
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="empty-letan">Không có dữ liệu</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chi tiết dịch vụ</h3>

            <p>
              <b>Mã DV:</b> {selected.MaDV}
            </p>

            <p>
              <b>Tên DV:</b> {selected.TenDV}
            </p>

            <p>
              <b>Giá:</b> {Number(selected.GiaDV).toLocaleString()} đ
            </p>

            <p>
              <b>Mô tả:</b> {selected.MoTa}
            </p>

            <button className="btn-danger" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

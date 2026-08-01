import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ChiTietDatPhong.css";

export default function ChiTietDatPhong() {
  const { MaDP } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get(`/datphong/detailBooking/${MaDP}`);

      setBooking(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Đang tải...</h2>;
  }

  if (!booking) {
    return <h2>Không tìm thấy đơn đặt phòng</h2>;
  }

  return (
    <div className="booking-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="detail-card">
        <img src={`http://localhost:8080${booking.HinhAnh}`} alt="" />

        <div className="detail-right">
          <div className="detail-header">
            <h2>{booking.TenLoai}</h2>

            <span className="status">{booking.TrangThai}</span>
          </div>

          <table>
            <tbody>
              <tr>
                <td>Mã đặt phòng</td>

                <td>{booking.MaDP}</td>
              </tr>

              <tr>
                <td>Chi nhánh</td>

                <td>{booking.TenCN}</td>
              </tr>

              <tr>
                <td>Địa chỉ</td>

                <td>{booking.DiaChi}</td>
              </tr>

              <tr>
                <td>Phòng</td>

                <td>{booking.SoPhong}</td>
              </tr>

              <tr>
                <td>Tầng</td>

                <td>{booking.Tang}</td>
              </tr>

              <tr>
                <td>Loại đặt</td>

                <td>{booking.LoaiDat}</td>
              </tr>

              <tr>
                <td>Ngày đặt</td>

                <td>{new Date(booking.NgayDat).toLocaleString("vi-VN")}</td>
              </tr>

              <tr>
                <td>Nhận phòng</td>

                <td>
                  {new Date(booking.NgayNhanPhong).toLocaleString("vi-VN")}
                </td>
              </tr>

              <tr>
                <td>Trả phòng</td>

                <td>
                  {new Date(booking.NgayTraPhong).toLocaleString("vi-VN")}
                </td>
              </tr>

              <tr>
                <td>Số người</td>

                <td>{booking.SoNguoi}</td>
              </tr>

              <tr>
                <td>Thanh toán</td>

                <td>{booking.TrangThaiHoaDon}</td>
              </tr>

              <tr>
                <td>Phương thức</td>

                <td>{booking.PhuongThucTT}</td>
              </tr>

              <tr>
                <td>Tổng tiền</td>

                <td>
                  {Number(booking.ThanhTien || 0).toLocaleString("vi-VN")} đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

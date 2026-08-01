import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function BookingDetailQR() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      console.log("Booking ID:", id);

      const res = await api.get(`/datphong/detail/${id}`);

      setBooking(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Đang tải...</h2>;
  }

  if (!booking) {
    return <h2>Không tìm thấy đơn đặt phòng.</h2>;
  }

  return (
    <div className="booking-detail">
      <h2>Thông tin đặt phòng</h2>

      <p>
        <b>Mã đặt:</b> {booking.MaDP}
      </p>
      <p>
        <b>Mã CTDP:</b> {booking.MaCTDP}
      </p>
      <p>
        <b>Khách:</b> {booking.HoTenKH}
      </p>
      <p>
        <b>Loại phòng:</b> {booking.TenLoai}
      </p>
      <p>
        <b>Phòng:</b> {booking.SoPhong}
      </p>
      <p>
        <b>Nhận phòng:</b> {booking.NgayNhanPhong}
      </p>
      <p>
        <b>Trả phòng:</b> {booking.NgayTraPhong}
      </p>
      <p>
        <b>Trạng thái:</b> {booking.TrangThaiPhong}
      </p>
    </div>
  );
}

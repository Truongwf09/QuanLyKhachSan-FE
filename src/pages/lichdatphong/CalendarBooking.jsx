import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import vi from "date-fns/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar-booking.css";

export default function CalendarBooking() {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  const locales = {
    vi,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const [bookings, setBookings] = useState([]);

  const loadData = async () => {
    try {
      const res = await api.get("/datphong/calendar");

      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const events = useMemo(() => {
    return bookings.map((b) => ({
      title: `${b.SoPhong} - ${b.HoTenKH}`,

      start: new Date(b.NgayNhanPhong),

      end: new Date(b.NgayTraPhong),

      status: b.TrangThai,

      room: b.SoPhong,

      resource: b,
    }));
  }, [bookings]);

  const EventCard = ({ event }) => {
    const checkIn = new Date(event.start).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const checkOut = new Date(event.end).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="booking-event">
        <div className="booking-room">P{event.room}</div>

        <div className="booking-name">{event.resource.HoTenKH}</div>

        <div className="booking-time">
          {checkIn} → {checkOut}
        </div>

        <div className={`booking-status ${event.status?.replaceAll(" ", "-")}`}>
          {event.status}
        </div>
      </div>
    );
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#dbeafe";
    let borderColor = "#3b82f6";

    switch (event.status) {
      case "chưa xác nhận":
        backgroundColor = "#fef3c7";
        borderColor = "#f59e0b";
        break;

      case "đã xác nhận":
        backgroundColor = "#dbeafe";
        borderColor = "#3b82f6";
        break;

      case "đã nhận phòng":
        backgroundColor = "#dcfce7";
        borderColor = "#10b981";
        break;

      case "trả phòng":
        backgroundColor = "#f1f5f9";
        borderColor = "#94a3b8";
        break;

      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        color: "#0f172a",
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 8px rgba(0,0,0,.05)",
        padding: "4px",
      },
    };
  };

  const today = new Date();

  const checkInToday = bookings.filter(
    (b) => b.NgayNhanPhong?.slice(0, 10) === today.toISOString().slice(0, 10),
  );

  const checkOutToday = bookings.filter(
    (b) => b.NgayTraPhong?.slice(0, 10) === today.toISOString().slice(0, 10),
  );

  const goToday = () => {
    setDate(new Date());
  };

  const goNext = () => {
    const newDate = new Date(date);

    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }

    setDate(newDate);
  };

  const goPrev = () => {
    const newDate = new Date(date);

    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }

    setDate(newDate);
  };

  return (
    <div className="calendar-layout">
      {/* LEFT */}

      <div className="calendar-sidebar">
        <div className="calendar-card">
          <h3>📥 Check-in hôm nay</h3>

          {checkInToday.length ? (
            checkInToday.map((item) => (
              <div key={item.MaDP} className="calendar-item">
                <b>{item.HoTenKH}</b>

                <span>Phòng {item.SoPhong}</span>
              </div>
            ))
          ) : (
            <p>Không có</p>
          )}
        </div>

        <div className="calendar-card">
          <h3>📤 Check-out hôm nay</h3>

          {checkOutToday.length ? (
            checkOutToday.map((item) => (
              <div key={item.MaDP} className="calendar-item">
                <b>{item.HoTenKH}</b>

                <span>Phòng {item.SoPhong}</span>
              </div>
            ))
          ) : (
            <p>Không có</p>
          )}
        </div>
      </div>

      {/* RIGHT */}

      <div className="calendar-main">
        <div className="calendar-topbar">
          <div className="calendar-left">
            <button onClick={goPrev} className="calendar-btn">
              ◀
            </button>

            <button onClick={goNext} className="calendar-btn">
              ▶
            </button>

            <button onClick={goToday} className="calendar-btn">
              Hôm nay
            </button>
          </div>

          <h2 className="calendar-title">{format(date, "MMMM yyyy")}</h2>

          <div className="calendar-right">
            <button
              className={
                view === "day" ? "calendar-btn active" : "calendar-btn"
              }
              onClick={() => setView("day")}
            >
              Ngày
            </button>

            <button
              className={
                view === "week" ? "calendar-btn active" : "calendar-btn"
              }
              onClick={() => setView("week")}
            >
              Tuần
            </button>

            <button
              className={
                view === "month" ? "calendar-btn active" : "calendar-btn"
              }
              onClick={() => setView("month")}
            >
              Tháng
            </button>
          </div>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          toolbar={false}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventCard,
          }}
          style={{
            height: 800,
          }}
        />
      </div>
    </div>
  );
}

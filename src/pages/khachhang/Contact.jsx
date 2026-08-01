import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/contact.css"; // Nhập stylesheet riêng biệt cho trang liên hệ
import {
  FaPhoneVolume,
  FaEnvelopeOpenText,
  FaLocationDot,
} from "react-icons/fa6";

export default function Contact() {
  const [contactForm, setContactForm] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      `Cảm ơn ${contactForm.name}! Yêu cầu liên hệ của bạn đã được gửi thành công.`,
    );
    setContactForm({ email: "", phone: "", name: "", message: "" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(
      `Cảm ơn bạn! Email ${newsletterEmail} đã được đăng ký nhận bản tin thành công.`,
    );
    setNewsletterEmail("");
  };

  return (
    <>
      <div className="contact-page">
        <div className="contact-main-grid">
          {/* LEFT */}

          <div className="contact-form-card">
            <div className="form-heading">
              <h2>Liên hệ với TEALHAVEN</h2>

              <p>
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại
                thông tin, đội ngũ TEALHAVEN sẽ phản hồi trong thời gian sớm
                nhất.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row-double">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="message"
                rows="7"
                placeholder="Nhập nội dung cần hỗ trợ..."
                value={contactForm.message}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="form-submit-btn">
                Gửi yêu cầu
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <div className="contact-side">
            <div className="contact-card">
              <div className="contact-icon">
                <FaPhoneVolume />
              </div>

              <div>
                <p>(+84) 1900 xxxx</p>

                <span>Hỗ trợ và đặt phòng 24/7</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaEnvelopeOpenText />
              </div>

              <div>
                <p>hotel.tealhaven@gmail.com</p>

                <span>Tiếp nhận mọi yêu cầu và phản hồi.</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaLocationDot />
              </div>

              <div>
                <p>TP. Hồ Chí Minh</p>

                <span>Trụ sở chính của hệ thống TEALHAVEN.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (Đồng bộ đồng nhất từ Home.jsx / About.jsx) */}
      <footer className="hotel-footer">
        <div className="footer-grid">
          <div>
            <h2>TEALHAVEN Hotel</h2>
            <p>
              Hệ thống khách sạn hiện đại, mang đến trải nghiệm nghỉ dưỡng đẳng
              cấp và tiện nghi.
            </p>
          </div>
          <div>
            <h3>Liên hệ</h3>
            <p>📍 TP. Hồ Chí Minh</p>
            <p>☎ 1900 xxxx</p>
            <p>✉ hotelphuonganh@gmail.com</p>
          </div>
        </div>
        <div className="copyright">© 2026 TEALHAVEN Hotel.</div>
      </footer>
    </>
  );
}

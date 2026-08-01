import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/about.css"; // Đồng bộ style từ Home.jsx hoặc tạo riêng About.css nếu cần
import {
  FaHotel,
  FaBed,
  FaUsers,
  FaStar,
  FaConciergeBell,
  FaShieldAlt,
  FaLeaf,
} from "react-icons/fa";

export default function About() {
  const [chiNhanh, setChiNhanh] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const cnRes = await api.get("/chinhanh");
        setChiNhanh(cnRes.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách chi nhánh:", err);
      }
    })();
  }, []);

  // Hàm helper để tạo src nhúng Google Map từ địa chỉ hoặc liên kết map của chi nhánh
  // Nếu database chi nhánh của bạn chưa có trường Bản đồ (embed), component sẽ tự động fallback tìm kiếm theo tên chi nhánh
  const getMapEmbedUrl = (cn) => {
    if (cn.BanDoEmbed) {
      return cn.BanDoEmbed; // Nếu bạn có lưu iframe src sẵn trong DB
    }
    // Fallback: Tự động tạo link search map theo Tên chi nhánh + TP. HCM
    const query = encodeURIComponent(`${cn.TenCN || ""}`);
    return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <>
      <div className="about-page">
        {/* STORY & QUOTE */}
        <section className="story-section">
          <div className="story-grid">
            <div className="story-quote">
              <p>
                "Khách hàng không chỉ nhớ chiếc giường êm ái ra sao, họ nhớ cảm
                giác ấm áp và sự quan tâm chân thành từ đội ngũ của chúng tôi."
              </p>
              <cite>— Ban Giám Đốc TEALHAVEN</cite>
            </div>

            <div className="story-content">
              <h2>Hơn 8 năm giữ lửa cho ngành dịch vụ</h2>
              <p>
                Nơi mỗi kỳ nghỉ trở thành một ký ức đẹp đẽ. Tại TEALHAVEN, chúng
                tôi tin rằng một hành trình đáng nhớ không chỉ được tạo nên bởi
                những căn phòng sang trọng hay những tiện nghi hiện đại, mà còn
                đến từ cảm giác được chào đón bằng sự chân thành và quan tâm
                trong từng khoảnh khắc. Từ nụ cười thân thiện của đội ngũ lễ
                tân, chiếc khăn ấm trao tận tay khi bạn vừa đặt chân đến, cho
                đến không gian nghỉ dưỡng được chăm chút tỉ mỉ trong từng chi
                tiết, tất cả đều được chuẩn bị với mong muốn mang đến cho bạn sự
                thoải mái và bình yên như đang ở chính ngôi nhà của mình.
              </p>
              <p>
                Hành trình của TEALHAVEN được xây dựng từ niềm tin và sự đồng
                hành của hàng nghìn khách hàng trong suốt nhiều năm qua. Chính
                sự tin yêu ấy đã trở thành động lực để chúng tôi không ngừng đổi
                mới, nâng cao chất lượng dịch vụ và hoàn thiện từng trải nghiệm.
                Trong tương lai, TEALHAVEN sẽ tiếp tục mở rộng hệ thống, ứng
                dụng những giải pháp dịch vụ thông minh và không ngừng nâng cao
                chất lượng phục vụ để mang đến những trải nghiệm vượt trên mong
                đợi. Với chúng tôi, mỗi vị khách không chỉ là một người lưu trú,
                mà còn là một người bạn đồng hành góp phần viết nên câu chuyện
                và giá trị của TEALHAVEN qua từng chuyến đi.
              </p>
            </div>
          </div>
        </section>

        {/* STATS SECTION (Đồng bộ style từ Home.jsx) */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <h3>{chiNhanh.length || 5}+</h3>

              <span>Chi nhánh</span>
            </div>

            <div className="stat-item">
              <h3>15+</h3>

              <span>Loại phòng</span>
            </div>

            <div className="stat-item">
              <h3>10,000+</h3>

              <span>Khách hàng</span>
            </div>

            <div className="stat-item">
              <h3>4.9★</h3>

              <span>Đánh giá</span>
            </div>
          </div>
        </section>

        {/* ================= CORE VALUES + BRANCH ================= */}

        <section className="core-map-section">
          {/* LEFT */}
          <div className="core-column">
            <h2>Những điều chúng tôi giữ vững</h2>

            <p className="core-desc">
              Chúng tôi không chỉ mang đến một nơi lưu trú, mà còn tạo nên những
              trải nghiệm đáng nhớ thông qua chất lượng dịch vụ, sự tận tâm và
              tinh thần hiếu khách trong từng chi tiết.
            </p>

            <div className="core-list">
              <div className="core-item">
                <div>
                  <h3>Không gian thoải mái</h3>

                  <p>
                    Phòng nghỉ được thiết kế hiện đại, đầy đủ tiện nghi và mang
                    đến cảm giác thư giãn trong suốt kỳ nghỉ. Mỗi chi tiết đều
                    được chăm chút để tạo nên không gian ấm cúng.
                  </p>
                </div>
              </div>

              <div className="core-item">
                <div>
                  <h3>Hỗ trợ 24/7</h3>

                  <p>
                    Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn mọi lúc với thái
                    độ tận tâm và chuyên nghiệp. Chúng tôi luôn đồng hành để
                    mang đến trải nghiệm tốt nhất.
                  </p>
                </div>
              </div>

              <div className="core-item">
                <div>
                  <h3>An toàn & Bảo mật</h3>

                  <p>
                    Quy trình đặt phòng và thanh toán được bảo mật, minh bạch và
                    nhanh chóng. Bạn có thể yên tâm trong mọi giao dịch và suốt
                    thời gian lưu trú.
                  </p>
                </div>
              </div>

              <div className="core-item">
                <div>
                  <h3>Vận hành bền vững</h3>

                  <p>
                    Chúng tôi hướng đến mô hình vận hành thân thiện với môi
                    trường và phát triển bền vững. Mỗi hành động nhỏ đều góp
                    phần tạo nên giá trị lâu dài cho cộng đồng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="branch-column">
            <h2>Hệ thống chi nhánh</h2>

            {chiNhanh.length > 0 && (
              <select
                className="branch-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(Number(e.target.value))}
              >
                {chiNhanh.map((cn, index) => (
                  <option key={cn.MaCN} value={index}>
                    {cn.TenCN}
                  </option>
                ))}
              </select>
            )}

            <div className="branch-map">
              <iframe
                title={chiNhanh[selectedBranch]?.TenCN || "Google Map"}
                src={
                  chiNhanh.length
                    ? getMapEmbedUrl(chiNhanh[selectedBranch])
                    : "https://maps.google.com/maps?q=Ho+Chi+Minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                }
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>

            <div className="branch-info">
              <h3>{chiNhanh[selectedBranch]?.TenCN || "TEALHAVEN"}</h3>

              <p>
                📍 {chiNhanh[selectedBranch]?.DiaChi || "Địa chỉ đang cập nhật"}
              </p>

              <p>☎ {chiNhanh[selectedBranch]?.SoDienThoai || "1900 xxxx"}</p>

              <a
                href={
                  chiNhanh.length
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        chiNhanh[selectedBranch].TenCN +
                          " " +
                          (chiNhanh[selectedBranch].DiaChi || ""),
                      )}`
                    : "https://maps.google.com"
                }
                target="_blank"
                rel="noreferrer"
                className="branch-btn"
              >
                Xem chỉ đường →
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER (Đồng bộ hoàn hảo từ Home.jsx) */}
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

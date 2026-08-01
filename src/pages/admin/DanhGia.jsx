import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { FaEye, FaEyeSlash, FaSearch, FaStar } from "react-icons/fa";

import "../../styles/danhgia.css";

export default function DanhGia() {
  /* =========================
        STATE
    ========================= */

  const [reviews, setReviews] = useState([]);

  const [statistics, setStatistics] = useState({
    Tong: 0,

    DangHien: 0,

    DaAn: 0,

    DiemTB: 0,

    Sao5: 0,

    Sao4: 0,

    Sao3: 0,

    Sao2: 0,

    Sao1: 0,
  });

  const [loading, setLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState(null);

  const [showModal, setShowModal] = useState(false);

  /* =========================
        FILTER
    ========================= */

  const [search, setSearch] = useState("");

  const [starFilter, setStarFilter] = useState("");

  /* =========================
        PAGINATION
    ========================= */

  const itemsPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
        LOAD DATA
    ========================= */

  useEffect(() => {
    loadReviews();
    loadStatistic();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, starFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const res = await api.get("/danhgia");

      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistic = async () => {
    try {
      const res = await api.get("/danhgia/statistic");

      setStatistics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
        FILTER DATA
    ========================= */

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const keyword = search.trim().toLowerCase();

      const hoTen = (item.HoTenKH || "").toLowerCase();

      const loaiPhong = (item.TenLoai || "").toLowerCase();

      const matchSearch =
        keyword === "" ||
        hoTen.includes(keyword) ||
        loaiPhong.includes(keyword);

      const matchStar =
        starFilter === "" || String(item.SoSao) === String(starFilter);

      return matchSearch && matchStar;
    });
  }, [reviews, search, starFilter]);

  /* =========================
        PAGINATION
    ========================= */

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const currentData = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage,
  );

  /* =========================
        DETAIL
    ========================= */

  const openDetail = async (MaDG) => {
    try {
      const res = await api.get(`/danhgia/detail/${MaDG}`);

      setSelectedReview(res.data);

      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
        HIDE REVIEW
    ========================= */

  const hideReview = async (MaDG, TrangThai) => {
    const message =
      TrangThai === 1
        ? "Bạn có chắc chắn muốn ẩn đánh giá này không?"
        : "Bạn có chắc chắn muốn hiển thị lại đánh giá này không?";

    if (!window.confirm(message)) return;

    try {
      await api.put(`/danhgia/${MaDG}/hide`);

      await loadReviews();
      await loadStatistic();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Quản lý đánh giá</h2>
          {/* <p>Theo dõi phản hồi của khách hàng về các loại phòng.</p> */}
        </div>
      </div>

      <div className="stat-wrapper">
        <button
          className="stat-arrow left"
          onClick={() =>
            document.querySelector(".stat-grid").scrollBy({
              left: -250,
              behavior: "smooth",
            })
          }
        >
          ❮
        </button>

        <div className="stat-grid">
          <div className="stat-card">
            <h4>Tổng đánh giá</h4>
            <h2>{statistics.Tong}</h2>
          </div>

          <div className="stat-card">
            <h4>Điểm trung bình</h4>
            <h2>
              {Number(statistics.DiemTB || 0).toFixed(1)}
              <FaStar className="star-icon" />
            </h2>
          </div>
          <div className="stat-card">
            <h4>Đang hiển thị</h4>
            <h2>{statistics.DangHien}</h2>
          </div>

          <div className="stat-card">
            <h4>Đã ẩn</h4>
            <h2>{statistics.DaAn}</h2>
          </div>

          <div className="stat-card">
            <h4>5 Sao</h4>
            <h2>{statistics.Sao5}</h2>
          </div>

          <div className="stat-card">
            <h4>4 Sao</h4>
            <h2>{statistics.Sao4}</h2>
          </div>

          <div className="stat-card">
            <h4>3 Sao</h4>
            <h2>{statistics.Sao3}</h2>
          </div>

          <div className="stat-card">
            <h4>1-2 Sao</h4>
            <h2>{Number(statistics.Sao1) + Number(statistics.Sao2)}</h2>
          </div>
        </div>

        <button
          className="stat-arrow right"
          onClick={() =>
            document.querySelector(".stat-grid").scrollBy({
              left: 250,
              behavior: "smooth",
            })
          }
        >
          ❯
        </button>
      </div>

      <div className="filter-box">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm theo khách hàng hoặc loại phòng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={starFilter}
          onChange={(e) => {
            setStarFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Tất cả số sao</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Khách hàng</th>
              <th>Loại phòng</th>
              <th>Số sao</th>
              <th>Nội dung</th>
              <th>Ngày đánh giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  Không có đánh giá.
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={item.MaDG}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.HoTenKH}</td>
                  <td>{item.TenLoai}</td>
                  <td>
                    <div className="star-cell">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < item.SoSao ? "#ffc107" : "#d9d9d9"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="review-content">
                    {item.NoiDung?.length > 50
                      ? `${item.NoiDung.substring(0, 50)}...`
                      : item.NoiDung}
                  </td>
                  <td>{new Date(item.NgayDG).toLocaleDateString("vi-VN")}</td>
                  <td>
                    {item.TrangThai === 1 ? (
                      <span className="status-active">Hiển thị</span>
                    ) : (
                      <span className="status-hidden">Đã ẩn</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        title="Chi tiết"
                        onClick={() => openDetail(item.MaDG)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className={
                          item.TrangThai === 1 ? "btn-hide" : "btn-show"
                        }
                        title={
                          item.TrangThai === 1
                            ? "Ẩn đánh giá"
                            : "Hiện lại đánh giá"
                        }
                        onClick={() => hideReview(item.MaDG, item.TrangThai)}
                      >
                        {item.TrangThai === 1 ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            «
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            »
          </button>
        </div>
      )}

      {showModal && selectedReview && (
        <div className="modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>Chi tiết đánh giá</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedReview(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <label>Khách hàng</label>
                <span>{selectedReview.HoTenKH}</span>
              </div>

              <div className="detail-row">
                <label>Email</label>
                <span>{selectedReview.Email}</span>
              </div>

              <div className="detail-row">
                <label>Số điện thoại</label>
                <span>{selectedReview.SoDT}</span>
              </div>

              <div className="detail-row">
                <label>Loại phòng</label>
                <span>{selectedReview.TenLoai}</span>
              </div>

              <div className="detail-row">
                <label>Ngày đánh giá</label>
                <span>
                  {new Date(selectedReview.NgayDG).toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="detail-row">
                <label>Số sao</label>
                <div className="modal-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < selectedReview.SoSao ? "#ffc107" : "#d9d9d9"}
                    />
                  ))}
                </div>
              </div>

              <div className="detail-content">
                <label>Nội dung đánh giá</label>
                <p>{selectedReview.NoiDung}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedReview(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import axios from "axios";
import { API_URL } from "./backend";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

const responseCache = new Map();

export async function getCachedData(path, ttl = 5 * 60 * 1000) {
  const cached = responseCache.get(path);
  if (cached && Date.now() - cached.createdAt < ttl) return cached.data;

  const { data } = await api.get(path);
  responseCache.set(path, { data, createdAt: Date.now() });
  return data;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 AUTO LOGOUT KHI TOKEN HẾT HẠN
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const getLoaiPhong = async () => {
  const res = await api.get("/loaiphong");
  return res.data;
};
export const getRooms = async () => {
  const res = await api.get("/phong");
  return res.data;
};

export default api;

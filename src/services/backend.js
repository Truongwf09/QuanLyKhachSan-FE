const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL;

export const BACKEND_URL = (configuredBackendUrl || "https://quanlykhachsan-be.onrender.com").replace(
  /\/$/,
  "",
);
export const API_URL = `${BACKEND_URL}/api`;

export function getRoomImageUrl(image) {
  if (!image) return "https://placehold.co/600x400?text=No+Image";

  let path = image;
  if (/^https?:\/\//i.test(image)) {
    const url = new URL(image);
    if (!["localhost", "127.0.0.1", "10.0.2.2"].includes(url.hostname)) return image;
    path = `${url.pathname}${url.search}`;
  }

  if (!path.startsWith("/uploads/")) path = `/uploads/loaiphong/${path.replace(/^\/+/, "")}`;
  return `${BACKEND_URL}${path}`;
}

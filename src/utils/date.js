export const normalizeDate = (date) => {
  if (!date) return "";

  // 👉 nếu là ISO string (có T)
  if (date.includes("T")) {
    return date.split("T")[0]; // 🔥 CẮT LUÔN, KHÔNG new Date
  }

  // 👉 nếu đã yyyy-MM-dd
  if (date.includes("-")) {
    return date;
  }

  // 👉 nếu là dd/mm/yyyy
  if (date.includes("/")) {
    const [d, m, y] = date.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return "";
};
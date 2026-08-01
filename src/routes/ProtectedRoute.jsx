import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  // lấy user an toàn
  const rawUser = localStorage.getItem("user");

  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  console.log("USER:", user);
  console.log("ROLE:", user?.role);
  console.log("ALLOWED:", roles);

  // chưa login
  if (!user) {
    if (
      roles.includes("admin") ||
      roles.includes("quanly") ||
      roles.includes("tiep_tan")
    ) {
      return <Navigate to="/admin/login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // chấp nhận cả khachhang và khach_hang
  const normalizedRole = user.role === "khach_hang" ? "khachhang" : user.role;

  // sai quyền
  if (roles.length && !roles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

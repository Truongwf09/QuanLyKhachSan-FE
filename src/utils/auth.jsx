export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  const user = {
    ...data.user,
    role: data.role
  };
  // 🔥 FIX: lấy role từ user
  localStorage.setItem("role", data.user.role);
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
export const getRole = () => {
  return localStorage.getItem("role");
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};
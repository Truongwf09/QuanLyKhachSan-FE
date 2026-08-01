import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Employees() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
    const res = await api.get("/nhanvien");
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    await api.post("/nhanvien", {
      ...form,
      MaCN: user.MaCN,
    });
    loadData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/nhanvien/${id}`);
    loadData();
  };

  const handleUpdate = async () => {
    await api.put(`/nhanvien/${editing.MaQTV}`, editing);
    setEditing(null);
    loadData();
  };

  return (
    <div>
      <h2>Nhân viên</h2>

      <button onClick={handleCreate}>Thêm</button>

      {data.map((nv) => (
        <div key={nv.MaQTV}>
          {nv.HoTen}

          <button onClick={() => setEditing(nv)}>Sửa</button>
          <button onClick={() => handleDelete(nv.MaQTV)}>Xoá</button>
        </div>
      ))}

      {editing && (
        <div>
          <input
            value={editing?.HoTen || ""}
            onChange={(e) => setEditing({ ...editing, HoTen: e.target.value })}
          />

          <button onClick={handleUpdate}>Lưu</button>
        </div>
      )}
    </div>
  );
}

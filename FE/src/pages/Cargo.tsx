import React from "react";

class Cargo extends React.Component {
  render() {
    return (
      <div>
        <h2>Danh sách Lô hàng</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Mô tả</th>
              <th>Container</th>
              <th>Trọng lượng</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có lô hàng
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card">
          <h3>Thêm / Sửa Lô hàng</h3>
          <div className="form-row">
            <input id="gDesc" placeholder="Mô tả hàng" />
          </div>
          <div className="form-row">
            <input id="gQty" placeholder="Trọng lượng (kg)" type="number" />
          </div>
          <div className="form-row">
            <select id="gType">
              <option>General</option>
              <option>Reefer</option>
              <option>Dangerous (DG)</option>
            </select>
          </div>
          <div className="form-row">
            <select id="gContainer">
              <option value="">- Chọn container -</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn" id="saveCargo">Lưu</button>
            <button className="btn" style={{ background: "#6b7280" }}>Hủy</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Cargo;
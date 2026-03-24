import React from "react";

class Containers extends React.Component {
  render() {
    return (
      <div>
        <h2>Danh sách Container</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Số</th>
              <th>Loại</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có container
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card">
          <h3>Thêm / Sửa Container</h3>
          <div className="form-row">
            <input id="cNumber" placeholder="Container No" />
          </div>
          <div className="form-row">
            <select id="cType">
              <option>20DC</option>
              <option>40HC</option>
              <option>REEFER</option>
              <option>OPEN_TOP</option>
            </select>
          </div>
          <div className="form-row">
            <input id="cLocation" placeholder="Vị trí (Depot / Port / Onboard)" />
          </div>
          <div className="form-row">
            <select id="cStatus">
              <option>Rỗng</option>
              <option>Đầy hàng</option>
              <option>Đang vận chuyển</option>
              <option>Bảo trì</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn" id="saveContainer">Lưu</button>
            <button className="btn" style={{ background: "#6b7280" }}>Hủy</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Containers;
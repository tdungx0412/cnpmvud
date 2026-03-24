import React from "react";

class Transport extends React.Component {
  render() {
    return (
      <div>
        <h2>Lịch trình vận tải</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã tham chiếu</th>
              <th>Số Container</th>
              <th>Biển kiểm soát</th>
              <th>Dự kiến</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có lịch trình vận tải
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card">
          <h3>Tạo Lịch trình</h3>
          <div className="form-row">
            <input id="tRef" placeholder="Mã tham chiếu / Booking" />
          </div>
          <div className="form-row">
            <select id="tContainer">
              <option value="">-- Chọn container --</option>
            </select>
          </div>
          <div className="form-row">
            <input id="tVehicle" placeholder="Số xe / Biển kiểm soát" />
          </div>
          <div className="form-row">
            <input id="tETA" type="date" />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn" id="saveTransport">Lưu</button>
            <button className="btn" style={{ background: "#6b7280" }}>Hủy</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Transport;
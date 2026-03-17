import React from "react";

class Staff extends React.Component {
  render() {
    return (
      <div className="grid">
        <div className="card">
          <h3>Nhân sự</h3>
          <table id="tblStaff">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Vai trò</th>
                <th>SĐT</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có nhân sự
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Thêm nhân sự</h3>
          <div className="form-row"><input id="sName" placeholder="Tên" /></div>
          <div className="form-row">
            <select id="sRole">
              <option value="">Vai trò</option>
              <option>Tài xế</option>
              <option>Điều phối</option>
              <option>Kho bãi</option>
              <option>Kế toán</option>
              <option>CSKH</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="form-row"><input id="sContact" placeholder="SĐT / Email" /></div>
          <div className="form-row">
            <select id="sStatus">
              <option>Hoạt động</option>
              <option>Tạm ngưng</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn" id="saveStaff">Lưu</button>
            <button className="btn" id="clearStaff" style={{ background: "#6b7280" }}>Hủy</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Staff;
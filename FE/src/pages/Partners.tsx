import React from "react";

class Partners extends React.Component {
  render() {
    return (
      <div>
        <h2>Danh sách Đối tác / Khách hàng</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Loại</th>
              <th>Liên hệ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có đối tác / khách hàng
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card">
          <h3>Thêm Đối tác</h3>
          <div className="form-row">
            <input id="pName" placeholder="Tên" />
          </div>
          <div className="form-row">
            <select id="pType">
              <option>Người gửi</option>
              <option>Người nhận</option>
              <option>Đơn vị vận chuyển</option>
              <option>Người giao nhận</option>
            </select>
          </div>
          <div className="form-row">
            <input id="pContact" placeholder="SĐT / Email" />
          </div>
          <div className="form-row">
            <select id="pStatus">
              <option>Hoạt động</option>
              <option>Tạm ngưng</option>
            </select>
          </div>
          <button className="btn" id="savePartner">Lưu</button>
        </div>
      </div>
    );
  }
}

export default Partners;
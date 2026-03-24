import React from "react";

class Finance extends React.Component {
  render() {
    return (
      <div>
        <h2>Chi phí theo Container</h2>
        <table>
          <thead>
            <tr>
              <th>Container</th>
              <th>Cước chính</th>
              <th>DEM/DET</th>
              <th>Local charge</th>
              <th>Phí khác</th>
              <th>Tổng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có dữ liệu chi phí
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card">
          <h3>Tính toán chi phí</h3>
          <div className="form-row">
            <select id="fSelectContainer">
              <option value="">- Chọn Container cần tính -</option>
            </select>
          </div>
          <div className="form-row">
            <input id="fBase" type="number" placeholder="Cước cơ bản (VND)" />
          </div>
          <div className="form-row">
            <input id="fDemDet" type="number" placeholder="Phí DEM/DET (VND)" />
          </div>
          <div className="form-row">
            <input id="fLocal" type="number" placeholder="Phí Local/Seal (VND)" />
          </div>
          <div className="form-row">
            <input id="fExtra" type="number" placeholder="Phí phát sinh (VND)" />
          </div>

          <button className="btn" id="btnSaveFinance">Lưu chi phí</button>
          <div id="costResult" style={{ marginTop: "15px", fontWeight: "bold", color: "#0b76ef" }}></div>
        </div>
      </div>
    );
  }
}

export default Finance;
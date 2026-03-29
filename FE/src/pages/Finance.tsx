import React from "react";

interface FinanceItem {
  id: string;
  containerId: string;
  baseCost: number;
  demDet: number;
  localCharge: number;
  extraCost: number;
  total: number;
}

interface FinanceState {
  finances: FinanceItem[];
  formData: {
    containerId: string;
    baseCost: string;
    demDet: string;
    localCharge: string;
    extraCost: string;
  };
  totalCost: number;
}

class Finance extends React.Component<{}, FinanceState> {
  state: FinanceState = {
    finances: [],
    formData: {
      containerId: "",
      baseCost: "",
      demDet: "",
      localCharge: "",
      extraCost: ""
    },
    totalCost: 0
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    }, () => this.calculateTotal());
  };

  calculateTotal = () => {
    const { baseCost, demDet, localCharge, extraCost } = this.state.formData;
    const total = 
      (Number(baseCost) || 0) + 
      (Number(demDet) || 0) + 
      (Number(localCharge) || 0) + 
      (Number(extraCost) || 0);
    this.setState({ totalCost: total });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFinance: FinanceItem = {
      id: Date.now().toString(),
      containerId: this.state.formData.containerId,
      baseCost: Number(this.state.formData.baseCost),
      demDet: Number(this.state.formData.demDet),
      localCharge: Number(this.state.formData.localCharge),
      extraCost: Number(this.state.formData.extraCost),
      total: this.state.totalCost
    };
    this.setState({
      finances: [...this.state.finances, newFinance],
      formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" },
      totalCost: 0
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa chi phí này?")) {
      this.setState({
        finances: this.state.finances.filter(f => f.id !== id)
      });
    }
  };

  formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  render() {
    const { finances, formData, totalCost } = this.state;

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
            {finances.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có dữ liệu chi phí
                </td>
              </tr>
            ) : (
              finances.map((f, index) => (
                <tr key={f.id}>
                  <td>{f.containerId || "N/A"}</td>
                  <td>{this.formatCurrency(f.baseCost)}</td>
                  <td>{this.formatCurrency(f.demDet)}</td>
                  <td>{this.formatCurrency(f.localCharge)}</td>
                  <td>{this.formatCurrency(f.extraCost)}</td>
                  <td style={{ fontWeight: "bold", color: "#0b76ef" }}>{this.formatCurrency(f.total)}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(f.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>Tính toán chi phí</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <select
                name="containerId"
                value={formData.containerId}
                onChange={this.handleInputChange}
                required
              >
                <option value="">- Chọn Container cần tính -</option>
                <option value="MSCU1234567">MSCU1234567</option>
                <option value="TGHU9876543">TGHU9876543</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="baseCost"
                type="number"
                placeholder="Cước cơ bản (VND)"
                value={formData.baseCost}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="demDet"
                type="number"
                placeholder="Phí DEM/DET (VND)"
                value={formData.demDet}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-row">
              <input
                name="localCharge"
                type="number"
                placeholder="Phí Local/Seal (VND)"
                value={formData.localCharge}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-row">
              <input
                name="extraCost"
                type="number"
                placeholder="Phí phát sinh (VND)"
                value={formData.extraCost}
                onChange={this.handleInputChange}
              />
            </div>

            <div style={{ marginTop: "15px", fontWeight: "bold", color: "#0b76ef", fontSize: "18px" }}>
              Tổng chi phí: {this.formatCurrency(totalCost)}
            </div>

            <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">Lưu chi phí</button>
              <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={() => {
                this.setState({
                  formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" },
                  totalCost: 0
                });
              }}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Finance;
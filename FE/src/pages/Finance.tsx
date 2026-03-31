import React from "react";
import api from "../services/api";

interface Finance {
  Id: string;
  ContainerId: string;
  BaseCost: number;
  DemDet: number;
  LocalCharge: number;
  ExtraCost: number;
  Total: number;
}

interface State {
  finances: Finance[];
  loading: boolean;
  formData: {
    containerId: string;
    baseCost: string;
    demDet: string;
    localCharge: string;
    extraCost: string;
  };
}

class Finance extends React.Component<{}, State> {
  state: State = {
    finances: [],
    loading: false,
    formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" }
  };

  componentDidMount() {
    this.fetchFinances();
  }

  fetchFinances = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/finance');
      console.log('Finance response:', response);
      this.setState({ 
        finances: response.data?.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance', {
        containerId: this.state.formData.containerId,
        baseCost: parseFloat(this.state.formData.baseCost) || 0,
        demDet: parseFloat(this.state.formData.demDet) || 0,
        localCharge: parseFloat(this.state.formData.localCharge) || 0,
        extraCost: parseFloat(this.state.formData.extraCost) || 0
      });
      this.resetForm();
      this.fetchFinances();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({ formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" } });
  };

  render() {
    const { finances, loading, formData } = this.state;

    return (
      <div>
        <h2>Chi phí theo Container</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>Container</th><th>Cước chính</th><th>DEM/DET</th><th>Local charge</th><th>Phí khác</th><th>Tổng</th></tr>
            </thead>
            <tbody>
              {finances.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có dữ liệu chi phí</td></tr>
              ) : (
                finances.map((f, index) => (
                  <tr key={f.Id}>
                    <td>{f.ContainerId}</td>
                    <td>{f.BaseCost.toLocaleString('vi-VN')} đ</td>
                    <td>{f.DemDet.toLocaleString('vi-VN')} đ</td>
                    <td>{f.LocalCharge.toLocaleString('vi-VN')} đ</td>
                    <td>{f.ExtraCost.toLocaleString('vi-VN')} đ</td>
                    <td><strong>{f.Total.toLocaleString('vi-VN')} đ</strong></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>Tính toán chi phí</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="containerId" placeholder="Container ID" value={formData.containerId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="baseCost" type="number" placeholder="Cước cơ bản (VND)" value={formData.baseCost} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="demDet" type="number" placeholder="Phí DEM/DET (VND)" value={formData.demDet} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="localCharge" type="number" placeholder="Phí Local/Seal (VND)" value={formData.localCharge} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="extraCost" type="number" placeholder="Phí phát sinh (VND)" value={formData.extraCost} onChange={this.handleInputChange} />
            </div>
            <button type="submit" className="btn">Lưu chi phí</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Finance;
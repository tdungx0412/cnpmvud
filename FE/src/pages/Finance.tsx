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

interface Container {
  Id: string;
  Number: string;
  Type: string;
  Location: string;
}

interface State {
  finances: Finance[];
  containers: Container[];
  loading: boolean;
  formData: {
    containerId: string;
    baseCost: string;
    demDet: string;
    localCharge: string;
    extraCost: string;
  };
  editingId: string | null;
}

class Finance extends React.Component<{}, State> {
  state: State = {
    finances: [],
    containers: [],
    loading: false,
    formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" },
    editingId: null
  };

  componentDidMount() {
    this.fetchFinances();
    this.fetchContainers();
  }

  fetchFinances = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/finance');
      this.setState({ finances: response.data?.data || [], loading: false });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  fetchContainers = async () => {
    try {
      const response = await api.get('/containers');
      this.setState({ containers: response.data?.data || [] });
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      containerId: this.state.formData.containerId || null,
      baseCost: parseFloat(this.state.formData.baseCost) || 0,
      demDet: parseFloat(this.state.formData.demDet) || 0,
      localCharge: parseFloat(this.state.formData.localCharge) || 0,
      extraCost: parseFloat(this.state.formData.extraCost) || 0
    };

    try {
      if (this.state.editingId) {
        await api.put(`/finance/${this.state.editingId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await api.post('/finance', payload);
        alert('Thêm thành công!');
      }
      this.resetForm();
      this.fetchFinances();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  handleEdit = (finance: Finance) => {
    this.setState({
      formData: {
        containerId: finance.ContainerId || "",
        baseCost: finance.BaseCost.toString(),
        demDet: finance.DemDet.toString(),
        localCharge: finance.LocalCharge.toString(),
        extraCost: finance.ExtraCost.toString()
      },
      editingId: finance.Id
    });
  };

  handleDelete = async (id: string) => {
    if (!window.confirm("Xóa chi phí này?")) return;
    try {
      await api.delete(`/finance/${id}`);
      alert('Xóa thành công!');
      this.fetchFinances();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: { containerId: "", baseCost: "", demDet: "", localCharge: "", extraCost: "" },
      editingId: null
    });
  };

  render() {
    const { finances, containers, loading, formData, editingId } = this.state;

    return (
      <div>
        <h2>Chi phí theo Container</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>Container</th><th>Cước chính</th><th>DEM/DET</th><th>Local charge</th><th>Phí khác</th><th>Tổng</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {finances.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có dữ liệu</td></tr>
              ) : (
                finances.map((f, index) => (
                  <tr key={f.Id}>
                    <td>{f.ContainerId || '–'}</td>
                    <td>{f.BaseCost.toLocaleString('vi-VN')} đ</td>
                    <td>{f.DemDet.toLocaleString('vi-VN')} đ</td>
                    <td>{f.LocalCharge.toLocaleString('vi-VN')} đ</td>
                    <td>{f.ExtraCost.toLocaleString('vi-VN')} đ</td>
                    <td><strong>{f.Total?.toLocaleString('vi-VN') || '0'} đ</strong></td>
                    <td>
                      <button className="btn btn-edit" onClick={() => this.handleEdit(f)} style={{marginRight:4}}>Sửa</button>
                      <button className="btn btn-delete" onClick={() => this.handleDelete(f.Id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>{editingId ? "Sửa Chi phí" : "Thêm Chi phí"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <select name="containerId" value={formData.containerId} onChange={this.handleInputChange}>
                <option value="">-- Chọn Container (hoặc để trống) --</option>
                {containers.map(c => (
                  <option key={c.Id} value={c.Id}>{c.Number} ({c.Type}) - {c.Location}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input name="baseCost" type="number" placeholder="Cước cơ bản (VNĐ)" value={formData.baseCost} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="demDet" type="number" placeholder="Phí DEM/DET (VNĐ)" value={formData.demDet} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="localCharge" type="number" placeholder="Phí Local/Seal (VNĐ)" value={formData.localCharge} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="extraCost" type="number" placeholder="Phí phát sinh (VNĐ)" value={formData.extraCost} onChange={this.handleInputChange} />
            </div>
            <div style={{display:"flex", gap:8}}>
              <button type="submit" className="btn">{editingId ? "Cập nhật" : "Lưu"}</button>
              {editingId && <button type="button" className="btn" style={{background:"#6b7280"}} onClick={this.resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Finance;
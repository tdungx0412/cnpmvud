import React from "react";
import api from "../services/api";

interface Cargo {
  Id: string;
  Description: string;
  Weight: number;
  Type: string;
  ContainerId: string;
}

interface State {
  cargos: Cargo[];
  loading: boolean;
  formData: {
    description: string;
    weight: string;
    type: string;
    containerId: string;
  };
}

class Cargo extends React.Component<{}, State> {
  state: State = {
    cargos: [],
    loading: false,
    formData: { description: "", weight: "", type: "General", containerId: "" }
  };

  componentDidMount() {
    this.fetchCargos();
  }

  fetchCargos = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/cargo');
      console.log('Cargo response:', response);
      this.setState({ 
        cargos: response.data?.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cargo', {
        ...this.state.formData,
        weight: parseFloat(this.state.formData.weight)
      });
      this.resetForm();
      this.fetchCargos();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({ formData: { description: "", weight: "", type: "General", containerId: "" } });
  };

  getTypeText = (type: string): string => {
    const map: Record<string, string> = {
      General: 'Hàng thường',
      Reefer: 'Hàng lạnh',
      Dangerous: 'Hàng nguy hiểm'
    };
    return map[type] || type;
  };

  render() {
    const { cargos, loading, formData } = this.state;

    return (
      <div>
        <h2>Danh sách Lô hàng</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Mô tả</th><th>Container</th><th>Trọng lượng</th><th>Loại</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {cargos.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có lô hàng</td></tr>
              ) : (
                cargos.map((c, index) => (
                  <tr key={c.Id}>
                    <td>{index + 1}</td>
                    <td>{c.Description}</td>
                    <td>{c.ContainerId}</td>
                    <td>{c.Weight} kg</td>
                    <td>{this.getTypeText(c.Type)}</td>
                    <td>
                      <button className="btn btn-edit">Sửa</button>
                      <button className="btn btn-delete">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>Thêm Lô hàng</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="description" placeholder="Mô tả hàng" value={formData.description} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="weight" type="number" placeholder="Trọng lượng (kg)" value={formData.weight} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="type" value={formData.type} onChange={this.handleInputChange}>
                <option>General</option><option>Reefer</option><option>Dangerous</option>
              </select>
            </div>
            <div className="form-row">
              <input name="containerId" placeholder="Container ID" value={formData.containerId} onChange={this.handleInputChange} />
            </div>
            <button type="submit" className="btn">Lưu</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Cargo;
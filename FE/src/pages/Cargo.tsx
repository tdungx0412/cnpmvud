import React from "react";
import api from "../services/api";

interface Cargo {
  Id: string;
  Description: string;
  Weight: number;
  Type: string;
  ContainerId: string;
}

interface Container {
  Id: string;
  Number: string;
  Type: string;
  Location: string;
  Status: string;
}

interface State {
  cargos: Cargo[];             
  containers: Container[];    
  loading: boolean;            
  formData: {               
    description: string;
    weight: string;
    type: string;
    containerId: string;
  };
  editingId: string | null;     
}

class Cargo extends React.Component<{}, State> {
  
  state: State = {
    cargos: [],
    containers: [],
    loading: false,
    formData: { 
      description: "", 
      weight: "", 
      type: "General", 
      containerId: "" 
    },
    editingId: null
  };

  componentDidMount() {
    this.fetchCargos();      
    this.fetchContainers();   
  }

  fetchCargos = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/cargo');
      this.setState({ 
        cargos: response.data?.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching cargos:', error);
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
    this.setState({ 
      formData: { 
        ...this.state.formData, 
        [name]: value 
      } 
    });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      description: this.state.formData.description,
      weight: parseFloat(this.state.formData.weight),
      type: this.state.formData.type,
      containerId: this.state.formData.containerId || null  // Cho phép null
    };

    try {
      if (this.state.editingId) {
        await api.put(`/cargo/${this.state.editingId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await api.post('/cargo', payload);
        alert('Thêm thành công!');
      }
      
      this.resetForm();
      this.fetchCargos();
    } catch (error: any) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra!';
      alert(message);
    }
  };

  handleEdit = (cargo: Cargo) => {
    this.setState({
      formData: {
        description: cargo.Description,
        weight: cargo.Weight.toString(),
        type: cargo.Type,
        containerId: cargo.ContainerId || ""
      },
      editingId: cargo.Id  
    });
  };

  handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa lô hàng này?")) {
      return;
    }
    
    try {
      await api.delete(`/cargo/${id}`);
      alert('Xóa thành công!');
      this.fetchCargos();  
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi xóa!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: { 
        description: "", 
        weight: "", 
        type: "General", 
        containerId: "" 
      },
      editingId: null
    });
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
    const { cargos, containers, loading, formData, editingId } = this.state;

    return (
      <div>
        <h2>Danh sách Lô hàng</h2>

        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mô tả</th>
                <th>Container</th>
                <th>Trọng lượng</th>
                <th>Loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cargos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                    Chưa có lô hàng
                  </td>
                </tr>
              ) : (
                cargos.map((c, index) => (
                  <tr key={c.Id}>
                    <td>{index + 1}</td>
                    <td>{c.Description}</td>
                    <td>{c.ContainerId || '–'}</td>
                    <td>{c.Weight.toLocaleString('vi-VN')} kg</td>
                    <td>{this.getTypeText(c.Type)}</td>
                    <td>
                      <button 
                        className="btn btn-edit" 
                        onClick={() => this.handleEdit(c)}
                        style={{ marginRight: '4px' }}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => this.handleDelete(c.Id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>{editingId ? "Sửa Lô hàng" : "Thêm Lô hàng"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input 
                name="description" 
                placeholder="Mô tả hàng" 
                value={formData.description} 
                onChange={this.handleInputChange} 
                required 
              />
            </div>
            <div className="form-row">
              <input 
                name="weight" 
                type="number" 
                placeholder="Trọng lượng (kg)" 
                value={formData.weight} 
                onChange={this.handleInputChange} 
                required 
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-row">
              <select name="type" value={formData.type} onChange={this.handleInputChange}>
                <option value="General">Hàng thường</option>
                <option value="Reefer">Hàng lạnh</option>
                <option value="Dangerous">Hàng nguy hiểm</option>
              </select>
            </div>
            <div className="form-row">
              <select 
                name="containerId" 
                value={formData.containerId} 
                onChange={this.handleInputChange}
              >
                <option value="">-- Chọn Container (hoặc để trống) --</option>
                {containers.map((c) => (
                  <option key={c.Id} value={c.Id}>
                    {c.Number} ({c.Type}) - {c.Location}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">
                {editingId ? "Cập nhật" : "Lưu"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn" 
                  style={{ background: "#6b7280" }} 
                  onClick={this.resetForm}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Cargo;
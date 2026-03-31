import React from "react";
import api from "../services/api";

interface Container {
  Id: string;
  Number: string;
  Type: string;
  Location: string;
  Status: string;
}

interface State {
  containers: Container[];
  loading: boolean;
  formData: {
    number: string;
    type: string;
    location: string;
    status: string;
  };
  editingId: string | null;
}

class Containers extends React.Component<{}, State> {
  state: State = {
    containers: [],
    loading: false,
    formData: { number: "", type: "20DC", location: "", status: "empty" },
    editingId: null
  };

  componentDidMount() {
    this.fetchContainers();
  }

  fetchContainers = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/containers');
      console.log('Containers response:', response);
      this.setState({ 
        containers: response.data?.data || [],
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
      if (this.state.editingId) {
        await api.put(`/containers/${this.state.editingId}`, this.state.formData);
      } else {
        await api.post('/containers', this.state.formData);
      }
      this.resetForm();
      this.fetchContainers();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  handleEdit = (container: Container) => {
    this.setState({
      formData: {
        number: container.Number,
        type: container.Type,
        location: container.Location,
        status: container.Status
      },
      editingId: container.Id
    });
  };

  handleDelete = async (id: string) => {
    if (window.confirm("Xóa container này?")) {
      try {
        await api.delete(`/containers/${id}`);
        this.fetchContainers();
      } catch (error) {
        alert('Có lỗi xảy ra!');
      }
    }
  };

  resetForm = () => {
    this.setState({
      formData: { number: "", type: "20DC", location: "", status: "empty" },
      editingId: null
    });
  };

  getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      empty: 'Rỗng',
      loaded: 'Đầy hàng',
      in_transit: 'Đang vận chuyển',
      maintenance: 'Bảo trì'
    };
    return map[status] || status;
  };

  render() {
    const { containers, loading, formData, editingId } = this.state;

    return (
      <div>
        <h2>Danh sách Container</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr>
                <th>#</th><th>Số</th><th>Loại</th><th>Vị trí</th><th>Trạng thái</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {containers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có container</td></tr>
              ) : (
                containers.map((c, index) => (
                  <tr key={c.Id}>
                    <td>{index + 1}</td>
                    <td>{c.Number}</td>
                    <td>{c.Type}</td>
                    <td>{c.Location}</td>
                    <td>{this.getStatusText(c.Status)}</td>
                    <td>
                      <button className="btn btn-edit" onClick={() => this.handleEdit(c)}>Sửa</button>
                      <button className="btn btn-delete" onClick={() => this.handleDelete(c.Id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>{editingId ? "Sửa Container" : "Thêm Container"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="number" placeholder="Container No" value={formData.number} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="type" value={formData.type} onChange={this.handleInputChange}>
                <option>20DC</option><option>40HC</option><option>REEFER</option><option>OPEN_TOP</option>
              </select>
            </div>
            <div className="form-row">
              <input name="location" placeholder="Vị trí" value={formData.location} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="empty">Rỗng</option><option value="loaded">Đầy hàng</option><option value="in_transit">Đang vận chuyển</option><option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">{editingId ? "Cập nhật" : "Lưu"}</button>
              {editingId && <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={this.resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Containers;
import React from "react";
import api from "../services/api";

interface Transport {
  Id: string;
  RefCode: string;
  ContainerId: string;
  Vehicle: string;
  ETA: string;
  Status: string;
}

interface Container {
  Id: string;
  Number: string;
  Type: string;
  Location: string;
}

interface State {
  transports: Transport[];
  containers: Container[];  
  loading: boolean;
  formData: {
    refCode: string;
    containerId: string;
    vehicle: string;
    eta: string;
    status: string;
  };
  editingId: string | null;
}

class Transport extends React.Component<{}, State> {
  state: State = {
    transports: [],
    containers: [],
    loading: false,
    formData: { 
      refCode: "", 
      containerId: "", 
      vehicle: "", 
      eta: "", 
      status: "pending" 
    },
    editingId: null
  };

  componentDidMount() {
    this.fetchTransports();
    this.fetchContainers();  
  }

  fetchTransports = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/transport');
      this.setState({ 
        transports: response.data?.data || [],
        loading: false 
      });
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
      refCode: this.state.formData.refCode,
      containerId: this.state.formData.containerId || null,
      vehicle: this.state.formData.vehicle,
      eta: this.state.formData.eta,
      status: this.state.formData.status
    };

    try {
      if (this.state.editingId) {
        // SỬA
        await api.put(`/transport/${this.state.editingId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        // THÊM
        await api.post('/transport', payload);
        alert('Thêm thành công!');
      }
      
      this.resetForm();
      this.fetchTransports();
    } catch (error: any) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra!';
      alert(message);
    }
  };

  handleEdit = (transport: Transport) => {
    this.setState({
      formData: {
        refCode: transport.RefCode,
        containerId: transport.ContainerId || "",
        vehicle: transport.Vehicle,
        eta: transport.ETA ? transport.ETA.split('T')[0] : "",
        status: transport.Status
      },
      editingId: transport.Id
    });
  };

  handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
      return;
    }
    
    try {
      await api.delete(`/transport/${id}`);
      alert('Xóa thành công!');
      this.fetchTransports();
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi xóa!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: { 
        refCode: "", 
        containerId: "", 
        vehicle: "", 
        eta: "", 
        status: "pending" 
      },
      editingId: null
    });
  };

  getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      pending: 'Chờ xử lý',
      in_progress: 'Đang thực hiện',
      completed: 'Hoàn thành'
    };
    return map[status] || status;
  };

  render() {
    const { transports, containers, loading, formData, editingId } = this.state;

    return (
      <div>
        <h2>Lịch trình vận tải</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã tham chiếu</th>
                <th>Container</th>
                <th>Biển kiểm soát</th>
                <th>Dự kiến đến</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {transports.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                    Chưa có lịch trình
                  </td>
                </tr>
              ) : (
                transports.map((t, index) => (
                  <tr key={t.Id}>
                    <td>{index + 1}</td>
                    <td>{t.RefCode}</td>
                    <td>{t.ContainerId || '–'}</td>
                    <td>{t.Vehicle}</td>
                    <td>{t.ETA ? new Date(t.ETA).toLocaleDateString('vi-VN') : '–'}</td>
                    <td>{this.getStatusText(t.Status)}</td>
                    <td>
                      <button 
                        className="btn btn-edit" 
                        onClick={() => this.handleEdit(t)}
                        style={{ marginRight: '4px' }}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => this.handleDelete(t.Id)}
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
          <h3>{editingId ? "Sửa Lịch trình" : "Tạo Lịch trình"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input 
                name="refCode" 
                placeholder="Mã tham chiếu / Booking No" 
                value={formData.refCode} 
                onChange={this.handleInputChange} 
                required 
              />
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
            <div className="form-row">
              <input 
                name="vehicle" 
                placeholder="Biển kiểm soát xe" 
                value={formData.vehicle} 
                onChange={this.handleInputChange} 
                required 
              />
            </div>
            <div className="form-row">
              <input 
                name="eta" 
                type="date" 
                value={formData.eta} 
                onChange={this.handleInputChange} 
                required 
              />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
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

export default Transport;
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

interface State {
  transports: Transport[];
  loading: boolean;
  formData: {
    refCode: string;
    containerId: string;
    vehicle: string;
    eta: string;
    status: string;
  };
}

class Transport extends React.Component<{}, State> {
  state: State = {
    transports: [],
    loading: false,
    formData: { refCode: "", containerId: "", vehicle: "", eta: "", status: "pending" }
  };

  componentDidMount() {
    this.fetchTransports();
  }

  fetchTransports = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/transport');
      console.log('Transport response:', response);
      this.setState({ 
        transports: response.data?.data || [],
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
      await api.post('/transport', this.state.formData);
      this.resetForm();
      this.fetchTransports();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({ formData: { refCode: "", containerId: "", vehicle: "", eta: "", status: "pending" } });
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
    const { transports, loading, formData } = this.state;

    return (
      <div>
        <h2>Lịch trình vận tải</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Mã tham chiếu</th><th>Container</th><th>Biển kiểm soát</th><th>Dự kiến</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {transports.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có lịch trình</td></tr>
              ) : (
                transports.map((t, index) => (
                  <tr key={t.Id}>
                    <td>{index + 1}</td>
                    <td>{t.RefCode}</td>
                    <td>{t.ContainerId}</td>
                    <td>{t.Vehicle}</td>
                    <td>{new Date(t.ETA).toLocaleDateString('vi-VN')}</td>
                    <td>{this.getStatusText(t.Status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>Tạo Lịch trình</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="refCode" placeholder="Mã tham chiếu / Booking" value={formData.refCode} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="containerId" placeholder="Container ID" value={formData.containerId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="vehicle" placeholder="Số xe / Biển kiểm soát" value={formData.vehicle} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="eta" type="date" value={formData.eta} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <button type="submit" className="btn">Lưu</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Transport;
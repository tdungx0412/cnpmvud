import React from "react";

interface TransportItem {
  id: string;
  refCode: string;
  containerId: string;
  vehicle: string;
  eta: string;
  status: string;
}

interface TransportState {
  transports: TransportItem[];
  formData: {
    refCode: string;
    containerId: string;
    vehicle: string;
    eta: string;
    status: string;
  };
}

class Transport extends React.Component<{}, TransportState> {
  state: TransportState = {
    transports: [],
    formData: {
      refCode: "",
      containerId: "",
      vehicle: "",
      eta: "",
      status: "pending"
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

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransport: TransportItem = {
      id: Date.now().toString(),
      ...this.state.formData
    };
    this.setState({
      transports: [...this.state.transports, newTransport],
      formData: { refCode: "", containerId: "", vehicle: "", eta: "", status: "pending" }
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
      this.setState({
        transports: this.state.transports.filter(t => t.id !== id)
      });
    }
  };

  render() {
    const { transports, formData } = this.state;

    const statusMap: Record<string, string> = {
      pending: "Chờ xử lý",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành"
    };

    return (
      <div>
        <h2>Lịch trình Vận tải</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã tham chiếu</th>
              <th>Container</th>
              <th>Biển kiểm soát</th>
              <th>Dự kiến</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {transports.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có lịch trình vận tải
                </td>
              </tr>
            ) : (
              transports.map((t, index) => (
                <tr key={t.id}>
                  <td>{index + 1}</td>
                  <td>{t.refCode}</td>
                  <td>{t.containerId || "N/A"}</td>
                  <td>{t.vehicle}</td>
                  <td>{t.eta || "N/A"}</td>
                  <td>{statusMap[t.status]}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(t.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>Tạo Lịch trình</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input
                name="refCode"
                placeholder="Mã tham chiếu / Booking"
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
                required
              >
                <option value="">-- Chọn container --</option>
                <option value="MSCU1234567">MSCU1234567</option>
                <option value="TGHU9876543">TGHU9876543</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="vehicle"
                placeholder="Số xe / Biển kiểm soát"
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
              <button type="submit" className="btn">Lưu</button>
              <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={() => this.setState({ formData: { refCode: "", containerId: "", vehicle: "", eta: "", status: "pending" } })}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Transport;
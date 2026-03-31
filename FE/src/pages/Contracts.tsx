import React from "react";
import api from "../services/api";

interface Contract {
  Id: string;
  ContractNo: string;
  PartnerId: string;
  StartDate: string;
  EndDate: string;
  Value: number;
  Status: string;
  Note: string;
}

interface State {
  contracts: Contract[];
  loading: boolean;
  formData: {
    contractNo: string;
    partnerId: string;
    startDate: string;
    endDate: string;
    value: string;
    status: string;
    note: string;
  };
}

class Contracts extends React.Component<{}, State> {
  state: State = {
    contracts: [],
    loading: false,
    formData: {
      contractNo: "",
      partnerId: "",
      startDate: "",
      endDate: "",
      value: "",
      status: "pending",
      note: ""
    }
  };

  componentDidMount() {
    this.fetchContracts();
  }

  fetchContracts = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/contracts');
      console.log('Contracts response:', response);
      this.setState({ 
        contracts: response.data?.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contracts', {
        ...this.state.formData,
        value: parseFloat(this.state.formData.value)
      });
      this.resetForm();
      this.fetchContracts();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        contractNo: "",
        partnerId: "",
        startDate: "",
        endDate: "",
        value: "",
        status: "pending",
        note: ""
      }
    });
  };

  getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      pending: 'Chờ ký',
      signed: 'Đã ký'
    };
    return map[status] || status;
  };

  render() {
    const { contracts, loading, formData } = this.state;

    return (
      <div>
        <h2>Hợp đồng</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Số HĐ</th><th>Đối tác</th><th>Hiệu lực</th><th>Giá trị</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có hợp đồng</td></tr>
              ) : (
                contracts.map((c, index) => (
                  <tr key={c.Id}>
                    <td>{index + 1}</td>
                    <td>{c.ContractNo}</td>
                    <td>{c.PartnerId}</td>
                    <td>{new Date(c.StartDate).toLocaleDateString('vi-VN')} - {new Date(c.EndDate).toLocaleDateString('vi-VN')}</td>
                    <td>{c.Value.toLocaleString('vi-VN')} đ</td>
                    <td>{this.getStatusText(c.Status)}</td>
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
          <h3>Thêm hợp đồng</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="contractNo" placeholder="Số hợp đồng" value={formData.contractNo} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="partnerId" placeholder="Đối tác (Partner ID)" value={formData.partnerId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row form-row-2">
              <input name="startDate" type="date" value={formData.startDate} onChange={this.handleInputChange} required />
              <input name="endDate" type="date" value={formData.endDate} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="value" type="number" placeholder="Giá trị (VNĐ)" value={formData.value} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="pending">Chờ ký</option>
                <option value="signed">Đã ký</option>
              </select>
            </div>
            <div className="form-row">
              <textarea name="note" placeholder="Ghi chú" value={formData.note} onChange={this.handleInputChange} rows={3}></textarea>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">Lưu</button>
              <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={this.resetForm}>Hủy</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Contracts;
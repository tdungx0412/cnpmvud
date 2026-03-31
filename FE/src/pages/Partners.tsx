import React from "react";
import api from "../services/api";

interface Partner {
  Id: string;
  Name: string;
  Type: string;
  Contact: string;
  Status: string;
}

interface State {
  partners: Partner[];
  loading: boolean;
  formData: { name: string; type: string; contact: string; status: string };
}

class Partners extends React.Component<{}, State> {
  state: State = {
    partners: [],
    loading: false,
    formData: { name: "", type: "sender", contact: "", status: "active" }
  };

  componentDidMount() {
    this.fetchPartners();
  }

  fetchPartners = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/partners');
      console.log('Partners response:', response);
      this.setState({ 
        partners: response.data?.data || [],
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
      await api.post('/partners', this.state.formData);
      this.resetForm();
      this.fetchPartners();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({ formData: { name: "", type: "sender", contact: "", status: "active" } });
  };

  getTypeText = (type: string): string => {
    const map: Record<string, string> = {
      sender: 'Người gửi',
      receiver: 'Người nhận',
      carrier: 'Đơn vị vận chuyển',
      forwarder: 'Người giao nhận'
    };
    return map[type] || type;
  };

  render() {
    const { partners, loading, formData } = this.state;

    return (
      <div>
        <h2>Danh sách Đối tác / Khách hàng</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Tên</th><th>Loại</th><th>Liên hệ</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có đối tác</td></tr>
              ) : (
                partners.map((p, index) => (
                  <tr key={p.Id}>
                    <td>{index + 1}</td>
                    <td>{p.Name}</td>
                    <td>{this.getTypeText(p.Type)}</td>
                    <td>{p.Contact}</td>
                    <td>{p.Status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>Thêm Đối tác</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Tên" value={formData.name} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="type" value={formData.type} onChange={this.handleInputChange}>
                <option value="sender">Người gửi</option>
                <option value="receiver">Người nhận</option>
                <option value="carrier">Đơn vị vận chuyển</option>
                <option value="forwarder">Người giao nhận</option>
              </select>
            </div>
            <div className="form-row">
              <input name="contact" placeholder="SĐT / Email" value={formData.contact} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
            <button type="submit" className="btn">Lưu</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Partners;
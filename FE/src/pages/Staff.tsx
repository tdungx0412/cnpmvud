import React from "react";
import api from "../services/api";

interface Staff {
  Id: string;
  Name: string;
  Role: string;
  Contact: string;
  Status: string;
}

interface State {
  staffs: Staff[];
  loading: boolean;
  formData: {
    name: string;
    role: string;
    contact: string;
    status: string;
  };
}

class Staff extends React.Component<{}, State> {
  state: State = {
    staffs: [],
    loading: false,
    formData: {
      name: "",
      role: "driver",
      contact: "",
      status: "active"
    }
  };

  componentDidMount() {
    this.fetchStaffs();
  }

  fetchStaffs = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/staff');
      console.log('Staff response:', response);
      this.setState({ 
        staffs: response.data?.data || [],
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
      await api.post('/staff', this.state.formData);
      this.resetForm();
      this.fetchStaffs();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        name: "",
        role: "driver",
        contact: "",
        status: "active"
      }
    });
  };

  getRoleText = (role: string): string => {
    const map: Record<string, string> = {
      driver: 'Tài xế',
      coordinator: 'Điều phối',
      warehouse: 'Kho bãi',
      accountant: 'Kế toán',
      cskh: 'CSKH',
      other: 'Khác'
    };
    return map[role] || role;
  };

  render() {
    const { staffs, loading, formData } = this.state;

    return (
      <div>
        <h2>Nhân sự</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Tên</th><th>Vai trò</th><th>SĐT</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {staffs.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có nhân sự</td></tr>
              ) : (
                staffs.map((s, index) => (
                  <tr key={s.Id}>
                    <td>{index + 1}</td>
                    <td>{s.Name}</td>
                    <td>{this.getRoleText(s.Role)}</td>
                    <td>{s.Contact}</td>
                    <td>{s.Status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}</td>
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
          <h3>Thêm nhân sự</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Tên" value={formData.name} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="role" value={formData.role} onChange={this.handleInputChange}>
                <option value="">Vai trò</option>
                <option value="driver">Tài xế</option>
                <option value="coordinator">Điều phối</option>
                <option value="warehouse">Kho bãi</option>
                <option value="accountant">Kế toán</option>
                <option value="cskh">CSKH</option>
                <option value="other">Khác</option>
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

export default Staff;
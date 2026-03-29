import React from "react";

interface StaffItem {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: string;
}

interface StaffState {
  staffs: StaffItem[];
  formData: {
    name: string;
    role: string;
    contact: string;
    status: string;
  };
}

class Staff extends React.Component<{}, StaffState> {
  state: StaffState = {
    staffs: [],
    formData: {
      name: "",
      role: "",
      contact: "",
      status: "Hoạt động"
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
    const newStaff: StaffItem = {
      id: Date.now().toString(),
      ...this.state.formData
    };
    this.setState({
      staffs: [...this.state.staffs, newStaff],
      formData: { name: "", role: "", contact: "", status: "Hoạt động" }
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân sự này?")) {
      this.setState({
        staffs: this.state.staffs.filter(s => s.id !== id)
      });
    }
  };

  render() {
    const { staffs, formData } = this.state;

    return (
      <div>
        <h2>Nhân sự</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có nhân sự
                </td>
              </tr>
            ) : (
              staffs.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.role || "N/A"}</td>
                  <td>{s.contact}</td>
                  <td>{s.status}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(s.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>Thêm Nhân sự</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                placeholder="Tên"
                value={formData.name}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <select name="role" value={formData.role} onChange={this.handleInputChange} required>
                <option value="">Vai trò</option>
                <option>Tài xế</option>
                <option>Điều phối</option>
                <option>Kho bãi</option>
                <option>Kế toán</option>
                <option>CSKH</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="contact"
                placeholder="SĐT / Email"
                value={formData.contact}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option>Hoạt động</option>
                <option>Tạm ngưng</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">Lưu</button>
              <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={() => this.setState({ formData: { name: "", role: "", contact: "", status: "Hoạt động" } })}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Staff;
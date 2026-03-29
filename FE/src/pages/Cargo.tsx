import React from "react";

interface CargoItem {
  id: string;
  description: string;
  weight: string;
  type: string;
  containerId: string;
}

interface CargoState {
  cargos: CargoItem[];
  formData: {
    description: string;
    weight: string;
    type: string;
    containerId: string;
  };
}

class Cargo extends React.Component<{}, CargoState> {
  state: CargoState = {
    cargos: [],
    formData: {
      description: "",
      weight: "",
      type: "General",
      containerId: ""
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
    const newCargo: CargoItem = {
      id: Date.now().toString(),
      ...this.state.formData
    };
    this.setState({
      cargos: [...this.state.cargos, newCargo],
      formData: { description: "", weight: "", type: "General", containerId: "" }
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa lô hàng này?")) {
      this.setState({
        cargos: this.state.cargos.filter(c => c.id !== id)
      });
    }
  };

  render() {
    const { cargos, formData } = this.state;

    return (
      <div>
        <h2>Danh sách Lô hàng</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
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
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.description}</td>
                  <td>{c.containerId || "N/A"}</td>
                  <td>{c.weight} kg</td>
                  <td>{c.type}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(c.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>Thêm Lô hàng</h3>
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
              />
            </div>
            <div className="form-row">
              <select name="type" value={formData.type} onChange={this.handleInputChange}>
                <option>General</option>
                <option>Reefer</option>
                <option>Dangerous (DG)</option>
              </select>
            </div>
            <div className="form-row">
              <select
                name="containerId"
                value={formData.containerId}
                onChange={this.handleInputChange}
              >
                <option value="">- Chọn container -</option>
                <option value="MSCU1234567">MSCU1234567</option>
                <option value="TGHU9876543">TGHU9876543</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn">Lưu</button>
              <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={() => this.setState({ formData: { description: "", weight: "", type: "General", containerId: "" } })}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Cargo;
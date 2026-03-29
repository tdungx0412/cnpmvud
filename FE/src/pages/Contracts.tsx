import React from "react";

interface Contract {
  id: string;
  contractNo: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  note: string;
}

interface ContractsState {
  contracts: Contract[];
  formData: {
    contractNo: string;
    partnerName: string;
    startDate: string;
    endDate: string;
    value: string;
    status: string;
    note: string;
  };
  editingId: string | null;
}

class Contracts extends React.Component<{}, ContractsState> {
  state: ContractsState = {
    contracts: [],
    formData: {
      contractNo: "",
      partnerName: "",
      startDate: "",
      endDate: "",
      value: "",
      status: "Chờ ký",
      note: ""
    },
    editingId: null
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    if (this.state.editingId) {
      this.setState({
        contracts: this.state.contracts.map(c =>
          c.id === this.state.editingId
            ? { ...this.state.formData, id: c.id, value: Number(this.state.formData.value) }
            : c
        ),
        formData: {
          contractNo: "",
          partnerName: "",
          startDate: "",
          endDate: "",
          value: "",
          status: "Chờ ký",
          note: ""
        },
        editingId: null
      });
    } else {
      const newContract: Contract = {
        id: Date.now().toString(),
        contractNo: this.state.formData.contractNo,
        partnerName: this.state.formData.partnerName,
        startDate: this.state.formData.startDate,
        endDate: this.state.formData.endDate,
        value: Number(this.state.formData.value),
        status: this.state.formData.status,
        note: this.state.formData.note
      };
      this.setState({
        contracts: [...this.state.contracts, newContract],
        formData: {
          contractNo: "",
          partnerName: "",
          startDate: "",
          endDate: "",
          value: "",
          status: "Chờ ký",
          note: ""
        }
      });
    }
  };

  handleEdit = (contract: Contract) => {
    this.setState({
      formData: {
        contractNo: contract.contractNo,
        partnerName: contract.partnerName,
        startDate: contract.startDate,
        endDate: contract.endDate,
        value: contract.value.toString(),
        status: contract.status,
        note: contract.note
      },
      editingId: contract.id
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa hợp đồng này?")) {
      this.setState({
        contracts: this.state.contracts.filter(c => c.id !== id)
      });
    }
  };

  handleCancel = () => {
    this.setState({
      formData: {
        contractNo: "",
        partnerName: "",
        startDate: "",
        endDate: "",
        value: "",
        status: "Chờ ký",
        note: ""
      },
      editingId: null
    });
  };

  formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  render() {
    const { contracts, formData, editingId } = this.state;

    return (
      <div>
        <h2>Hợp đồng</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Số HĐ</th>
              <th>Đối tác</th>
              <th>Hiệu lực</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có hợp đồng
                </td>
              </tr>
            ) : (
              contracts.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.contractNo}</td>
                  <td>{c.partnerName}</td>
                  <td>{this.formatDate(c.startDate)} - {this.formatDate(c.endDate)}</td>
                  <td>{this.formatCurrency(c.value)}</td>
                  <td>{c.status}</td>
                  <td>
                    <button className="btn btn-edit" style={{ marginRight: "8px" }} onClick={() => this.handleEdit(c)}>Sửa</button>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(c.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>{editingId ? "Sửa Hợp đồng" : "Thêm Hợp đồng"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input
                name="contractNo"
                placeholder="Số hợp đồng"
                value={formData.contractNo}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="partnerName"
                placeholder="Khách hàng / Đối tác"
                value={formData.partnerName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row form-row-2">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={this.handleInputChange}
                required
              />
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="value"
                type="number"
                placeholder="Giá trị (VNĐ)"
                value={formData.value}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option>Chờ ký</option>
                <option>Đã ký</option>
              </select>
            </div>
            <div className="form-row">
              <textarea
                name="note"
                placeholder="Ghi chú"
                rows={3}
                value={formData.note}
                onChange={this.handleInputChange}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="submit" className="btn">{editingId ? "Cập nhật" : "Lưu"}</button>
              {editingId && (
                <>
                  <button type="button" className="btn" style={{ background: "#6b7280" }} onClick={this.handleCancel}>
                    Hủy
                  </button>
                  <button type="button" className="btn" style={{ background: "#ef4444" }} onClick={() => this.handleDelete(editingId)}>
                    Xóa
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Contracts;
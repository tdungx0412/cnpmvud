import React from "react";

interface Invoice {
  id: string;
  invoiceNo: string;
  contractId: string;
  containerId: string;
  partnerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  vat: number;
  total: number;
  status: string;
  paidDate: string;
  note: string;
}

interface InvoicesState {
  invoices: Invoice[];
  formData: {
    invoiceNo: string;
    contractId: string;
    containerId: string;
    partnerName: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    vat: string;
    total: number;
    status: string;
    paidDate: string;
    note: string;
  };
  editingId: string | null;
}

class Invoices extends React.Component<{}, InvoicesState> {
  state: InvoicesState = {
    invoices: [],
    formData: {
      invoiceNo: "",
      contractId: "",
      containerId: "",
      partnerName: "",
      issueDate: "",
      dueDate: "",
      amount: "",
      vat: "10",
      total: 0,
      status: "Chưa thanh toán",
      paidDate: "",
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
    }, () => this.calculateTotal());
  };

  calculateTotal = () => {
    const { amount, vat } = this.state.formData;
    const amountNum = Number(amount) || 0;
    const vatNum = Number(vat) || 0;
    const total = amountNum + (amountNum * vatNum / 100);
    this.setState(prev => ({
      formData: { ...prev.formData, total }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(this.state.formData.amount);
    const vatNum = Number(this.state.formData.vat);
    const total = amountNum + (amountNum * vatNum / 100);

    if (this.state.editingId) {
      this.setState({
        invoices: this.state.invoices.map(inv =>
          inv.id === this.state.editingId
            ? { 
                ...inv, 
                invoiceNo: this.state.formData.invoiceNo,
                partnerName: this.state.formData.partnerName,
                issueDate: this.state.formData.issueDate,
                dueDate: this.state.formData.dueDate,
                amount: amountNum,
                vat: vatNum,
                total,
                status: this.state.formData.status,
                paidDate: this.state.formData.paidDate,
                note: this.state.formData.note
              }
            : inv
        ),
        formData: {
          invoiceNo: "",
          contractId: "",
          containerId: "",
          partnerName: "",
          issueDate: "",
          dueDate: "",
          amount: "",
          vat: "10",
          total: 0,
          status: "Chưa thanh toán",
          paidDate: "",
          note: ""
        },
        editingId: null
      });
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNo: this.state.formData.invoiceNo,
        contractId: this.state.formData.contractId,
        containerId: this.state.formData.containerId,
        partnerName: this.state.formData.partnerName,
        issueDate: this.state.formData.issueDate,
        dueDate: this.state.formData.dueDate,
        amount: amountNum,
        vat: vatNum,
        total,
        status: this.state.formData.status,
        paidDate: this.state.formData.paidDate,
        note: this.state.formData.note
      };
      this.setState({
        invoices: [...this.state.invoices, newInvoice],
        formData: {
          invoiceNo: "",
          contractId: "",
          containerId: "",
          partnerName: "",
          issueDate: "",
          dueDate: "",
          amount: "",
          vat: "10",
          total: 0,
          status: "Chưa thanh toán",
          paidDate: "",
          note: ""
        }
      });
    }
  };

  handleEdit = (invoice: Invoice) => {
    this.setState({
      formData: {
        invoiceNo: invoice.invoiceNo,
        contractId: invoice.contractId,
        containerId: invoice.containerId,
        partnerName: invoice.partnerName,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        amount: invoice.amount.toString(),
        vat: invoice.vat.toString(),
        total: invoice.total,
        status: invoice.status,
        paidDate: invoice.paidDate,
        note: invoice.note
      },
      editingId: invoice.id
    });
  };

  handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      this.setState({
        invoices: this.state.invoices.filter(inv => inv.id !== id)
      });
    }
  };

  handleCancel = () => {
    this.setState({
      formData: {
        invoiceNo: "",
        contractId: "",
        containerId: "",
        partnerName: "",
        issueDate: "",
        dueDate: "",
        amount: "",
        vat: "10",
        total: 0,
        status: "Chưa thanh toán",
        paidDate: "",
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
    const { invoices, formData, editingId } = this.state;

    return (
      <div>
        <h2>Hóa đơn</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Số HĐ</th>
              <th>Đối tác</th>
              <th>Ngày xuất</th>
              <th>Hạn TT</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#94a3b8" }}>
                  Chưa có hóa đơn
                </td>
              </tr>
            ) : (
              invoices.map((inv, index) => (
                <tr key={inv.id}>
                  <td>{index + 1}</td>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.partnerName}</td>
                  <td>{this.formatDate(inv.issueDate)}</td>
                  <td>{this.formatDate(inv.dueDate)}</td>
                  <td style={{ fontWeight: "bold", color: "#0b76ef" }}>{this.formatCurrency(inv.total)}</td>
                  <td>{inv.status}</td>
                  <td>
                    <button className="btn btn-edit" style={{ marginRight: "8px" }} onClick={() => this.handleEdit(inv)}>Sửa</button>
                    <button className="btn btn-delete" onClick={() => this.handleDelete(inv.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="card">
          <h3>{editingId ? "Chỉnh sửa Hóa đơn" : "Thêm Hóa đơn"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input
                name="invoiceNo"
                placeholder="Số hóa đơn"
                value={formData.invoiceNo}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="partnerName"
                placeholder="Đối tác"
                value={formData.partnerName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row form-row-2">
              <input
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={this.handleInputChange}
                required
              />
              <input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="amount"
                type="number"
                placeholder="Tiền hàng (VNĐ)"
                value={formData.amount}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-row form-row-2">
              <input
                name="vat"
                type="number"
                placeholder="VAT (%)"
                value={formData.vat}
                onChange={this.handleInputChange}
              />
              <input
                type="number"
                placeholder="Tổng tiền"
                value={formData.total}
                disabled
                style={{ background: "#f5f7fb", fontWeight: "bold", color: "#0b76ef" }}
              />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option>Chưa thanh toán</option>
                <option>Đã thanh toán</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="paidDate"
                type="date"
                value={formData.paidDate}
                onChange={this.handleInputChange}
              />
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

export default Invoices;
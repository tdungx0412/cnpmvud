import React from "react";
import api from "../services/api";

interface Invoice {
  Id: string;
  InvoiceNo: string;
  ContractId: string;
  ContainerId: string;
  PartnerId: string;
  IssueDate: string;
  DueDate: string;
  Amount: number;
  Vat: number;
  Total: number;
  Status: string;
  PaidDate: string;
  Note: string;
}

interface State {
  invoices: Invoice[];
  loading: boolean;
  formData: {
    invoiceNo: string;
    contractId: string;
    containerId: string;
    partnerId: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    vat: string;
    status: string;
    paidDate: string;
    note: string;
  };
}

class Invoices extends React.Component<{}, State> {
  state: State = {
    invoices: [],
    loading: false,
    formData: {
      invoiceNo: "",
      contractId: "",
      containerId: "",
      partnerId: "",
      issueDate: "",
      dueDate: "",
      amount: "",
      vat: "10",
      status: "unpaid",
      paidDate: "",
      note: ""
    }
  };

  componentDidMount() {
    this.fetchInvoices();
  }

  fetchInvoices = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/invoices');
      console.log('Invoices response:', response);
      this.setState({ 
        invoices: response.data?.data || [],
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
      const amount = parseFloat(this.state.formData.amount) || 0;
      const vat = parseFloat(this.state.formData.vat) || 10;
      await api.post('/invoices', {
        ...this.state.formData,
        amount,
        vat
      });
      this.resetForm();
      this.fetchInvoices();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        invoiceNo: "",
        contractId: "",
        containerId: "",
        partnerId: "",
        issueDate: "",
        dueDate: "",
        amount: "",
        vat: "10",
        status: "unpaid",
        paidDate: "",
        note: ""
      }
    });
  };

  getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn'
    };
    return map[status] || status;
  };

  render() {
    const { invoices, loading, formData } = this.state;

    return (
      <div>
        <h2>Hóa đơn</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Số HĐơn</th><th>Hợp đồng</th><th>Container</th><th>Đối tác</th><th>Ngày xuất</th><th>Hạn TT</th><th>Tổng tiền</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#94a3b8" }}>Chưa có hóa đơn</td></tr>
              ) : (
                invoices.map((i, index) => (
                  <tr key={i.Id}>
                    <td>{index + 1}</td>
                    <td>{i.InvoiceNo}</td>
                    <td>{i.ContractId}</td>
                    <td>{i.ContainerId}</td>
                    <td>{i.PartnerId}</td>
                    <td>{new Date(i.IssueDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(i.DueDate).toLocaleDateString('vi-VN')}</td>
                    <td><strong>{i.Total.toLocaleString('vi-VN')} đ</strong></td>
                    <td>{this.getStatusText(i.Status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>Thêm hóa đơn</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="invoiceNo" placeholder="Số hóa đơn" value={formData.invoiceNo} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="contractId" placeholder="Hợp đồng ID" value={formData.contractId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="containerId" placeholder="Container ID" value={formData.containerId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row">
              <input name="partnerId" placeholder="Đối tác ID" value={formData.partnerId} onChange={this.handleInputChange} />
            </div>
            <div className="form-row form-row-2">
              <input name="issueDate" type="date" value={formData.issueDate} onChange={this.handleInputChange} required />
              <input name="dueDate" type="date" value={formData.dueDate} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <input name="amount" type="number" placeholder="Tiền hàng (VNĐ)" value={formData.amount} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row form-row-2">
              <input name="vat" type="number" placeholder="VAT (%)" value={formData.vat} onChange={this.handleInputChange} />
              <input name="total" type="number" placeholder="Tổng tiền" disabled />
            </div>
            <div className="form-row">
              <select name="status" value={formData.status} onChange={this.handleInputChange}>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>
            <div className="form-row">
              <input name="paidDate" type="date" value={formData.paidDate} onChange={this.handleInputChange} />
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

export default Invoices;
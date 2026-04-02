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
  PaidDate: string | null;
  Note: string | null;
}

interface Contract { 
  Id: string; 
  ContractNo: string; 
}

interface Container { 
  Id: string; 
  Number: string; 
}

interface Partner { 
  Id: string; 
  Name: string; 
}

interface State {
  invoices: Invoice[];
  contracts: Contract[];
  containers: Container[];
  partners: Partner[];
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
  editingId: string | null;
}

class Invoices extends React.Component<{}, State> {
  state: State = {
    invoices: [], 
    contracts: [], 
    containers: [], 
    partners: [],
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
    },
    editingId: null
  };

  componentDidMount() {
    this.fetchInvoices();
    this.fetchContracts();
    this.fetchContainers();
    this.fetchPartners();
  }

  fetchInvoices = async () => {
    try {
      this.setState({ loading: true });
      const res = await api.get('/invoices');
      this.setState({ 
        invoices: res.data?.data || [], 
        loading: false 
      });
    } catch (e) { 
      console.error(e); 
      this.setState({ loading: false }); 
    }
  };

  fetchContracts = async () => { 
    try { 
      const res = await api.get('/contracts'); 
      this.setState({ contracts: res.data?.data || [] }); 
    } catch(e) { 
      console.error('Error fetching contracts:', e);
    } 
  };

  fetchContainers = async () => { 
    try { 
      const res = await api.get('/containers'); 
      this.setState({ containers: res.data?.data || [] }); 
    } catch(e) { 
      console.error('Error fetching containers:', e);
    } 
  };

  fetchPartners = async () => { 
    try { 
      const res = await api.get('/partners'); 
      this.setState({ partners: res.data?.data || [] }); 
    } catch(e) { 
      console.error('Error fetching partners:', e);
    } 
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ 
      formData: { ...this.state.formData, [name]: value } 
    });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(this.state.formData.amount) || 0;
    const vat = parseFloat(this.state.formData.vat) || 10;
    
    const payload = {
      invoiceNo: this.state.formData.invoiceNo,
      contractId: this.state.formData.contractId || null,
      containerId: this.state.formData.containerId || null,
      partnerId: this.state.formData.partnerId || null,
      issueDate: this.state.formData.issueDate,
      dueDate: this.state.formData.dueDate,
      amount, 
      vat,
      status: this.state.formData.status,
      paidDate: this.state.formData.paidDate || null,
      note: this.state.formData.note
    };

    try {
      if (this.state.editingId) {
        await api.put(`/invoices/${this.state.editingId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await api.post('/invoices', payload);
        alert('Thêm thành công!');
      }
      this.resetForm();
      this.fetchInvoices();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  handleEdit = (inv: Invoice) => {
    this.setState({
      formData: {
        invoiceNo: inv.InvoiceNo,
        contractId: inv.ContractId || "",
        containerId: inv.ContainerId || "",
        partnerId: inv.PartnerId || "",
        issueDate: inv.IssueDate?.split('T')[0] || "",
        dueDate: inv.DueDate?.split('T')[0] || "",
        amount: inv.Amount.toString(),
        vat: inv.Vat?.toString() || "10",
        status: inv.Status,
        paidDate: inv.PaidDate?.split('T')[0] || "",
        note: inv.Note || ""
      },
      editingId: inv.Id
    });
  };

  handleDelete = async (id: string) => {
    if (!window.confirm("Xóa hóa đơn này?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      alert('Xóa thành công!');
      this.fetchInvoices();
    } catch { 
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
      },
      editingId: null
    });
  };

  getStatusText = (s: string) => {
    const map: Record<string, string> = { 
      unpaid: 'Chưa TT', 
      paid: 'Đã TT', 
      overdue: 'Quá hạn' 
    };
    return map[s] || s;
  };

  render() {
    const { 
      invoices, 
      contracts, 
      containers, 
      partners, 
      loading, 
      formData, 
      editingId 
    } = this.state;

    return (
      <div>
        <h2>Hóa đơn</h2>
        
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Số HĐơn</th>
                <th>Hợp đồng</th>
                <th>Container</th>
                <th>Đối tác</th>
                <th>Ngày xuất</th>
                <th>Hạn TT</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{textAlign:"center", color:"#94a3b8"}}>
                    Chưa có hóa đơn
                  </td>
                </tr>
              ) : (
                invoices.map((i, idx) => (
                  <tr key={i.Id}>
                    <td>{idx + 1}</td>
                    <td>{i.InvoiceNo}</td>
                    <td>{i.ContractId || '–'}</td>
                    <td>{i.ContainerId || '–'}</td>
                    <td>{i.PartnerId || '–'}</td>
                    <td>{i.IssueDate?.split('T')[0]}</td>
                    <td>{i.DueDate?.split('T')[0]}</td>
                    <td>{i.Total?.toLocaleString('vi-VN')} đ</td>
                    <td>{this.getStatusText(i.Status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Form Thêm/Sửa */}
        <div className="card">
          <h3>{editingId ? "Sửa Hóa đơn" : "Thêm Hóa đơn"}</h3>
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
              <select 
                name="contractId" 
                value={formData.contractId} 
                onChange={this.handleInputChange}
              >
                <option value="">-- Chọn Hợp đồng --</option>
                {contracts.map(c => (
                  <option key={c.Id} value={c.Id}>{c.ContractNo}</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <select 
                name="containerId" 
                value={formData.containerId} 
                onChange={this.handleInputChange}
              >
                <option value="">-- Chọn Container --</option>
                {containers.map(c => (
                  <option key={c.Id} value={c.Id}>{c.Number}</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <select 
                name="partnerId" 
                value={formData.partnerId} 
                onChange={this.handleInputChange}
              >
                <option value="">-- Chọn Đối tác --</option>
                {partners.map(p => (
                  <option key={p.Id} value={p.Id}>{p.Name}</option>
                ))}
              </select>
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
            
            <div className="form-row">
              <input 
                name="vat" 
                type="number" 
                placeholder="VAT (%)" 
                value={formData.vat} 
                onChange={this.handleInputChange}
              />
            </div>
            
            <div className="form-row">
              <select 
                name="status" 
                value={formData.status} 
                onChange={this.handleInputChange}
              >
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
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
                value={formData.note} 
                onChange={this.handleInputChange} 
                rows={3}
              />
            </div>
            
            <div style={{display:"flex", gap:8}}>
              <button type="submit" className="btn">
                {editingId ? "Cập nhật" : "Lưu"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn" 
                  style={{background:"#6b7280"}} 
                  onClick={this.resetForm}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Invoices;
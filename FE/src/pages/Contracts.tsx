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

interface Partner {
  Id: string;
  Name: string;
  Type: string;
}

interface State {
  contracts: Contract[];
  partners: Partner[];
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
  editingId: string | null;
}

class Contracts extends React.Component<{}, State> {
  state: State = {
    contracts: [],
    partners: [],
    loading: false,
    formData: { contractNo: "", partnerId: "", startDate: "", endDate: "", value: "", status: "pending", note: "" },
    editingId: null
  };

  componentDidMount() {
    this.fetchContracts();
    this.fetchPartners();
  }

  fetchContracts = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get('/contracts');
      this.setState({ contracts: response.data?.data || [], loading: false });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  fetchPartners = async () => {
    try {
      const response = await api.get('/partners');
      this.setState({ partners: response.data?.data || [] });
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      contractNo: this.state.formData.contractNo,
      partnerId: this.state.formData.partnerId || null,
      startDate: this.state.formData.startDate,
      endDate: this.state.formData.endDate,
      value: parseFloat(this.state.formData.value) || 0,
      status: this.state.formData.status,
      note: this.state.formData.note
    };

    try {
      if (this.state.editingId) {
        await api.put(`/contracts/${this.state.editingId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await api.post('/contracts', payload);
        alert('Thêm thành công!');
      }
      this.resetForm();
      this.fetchContracts();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  handleEdit = (contract: Contract) => {
    this.setState({
      formData: {
        contractNo: contract.ContractNo,
        partnerId: contract.PartnerId || "",
        startDate: contract.StartDate?.split('T')[0] || "",
        endDate: contract.EndDate?.split('T')[0] || "",
        value: contract.Value.toString(),
        status: contract.Status,
        note: contract.Note || ""
      },
      editingId: contract.Id
    });
  };

  handleDelete = async (id: string) => {
    if (!window.confirm("Xóa hợp đồng này?")) return;
    try {
      await api.delete(`/contracts/${id}`);
      alert('Xóa thành công!');
      this.fetchContracts();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  resetForm = () => {
    this.setState({
      formData: { contractNo: "", partnerId: "", startDate: "", endDate: "", value: "", status: "pending", note: "" },
      editingId: null
    });
  };

  getStatusText = (status: string): string => ({
    pending: 'Chờ ký',
    signed: 'Đã ký'
  }[status] || status);

  render() {
    const { contracts, partners, loading, formData, editingId } = this.state;

    return (
      <div>
        <h2>Hợp đồng</h2>
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr><th>STT</th><th>Số HĐ</th><th>Đối tác</th><th>Hiệu lực</th><th>Giá trị</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign:"center", color:"#94a3b8"}}>Chưa có hợp đồng</td></tr>
              ) : (
                contracts.map((c, index) => (
                  <tr key={c.Id}>
                    <td>{index+1}</td>
                    <td>{c.ContractNo}</td>
                    <td>{c.PartnerId || '–'}</td>
                    <td>{c.StartDate?.split('T')[0]} → {c.EndDate?.split('T')[0]}</td>
                    <td>{c.Value.toLocaleString('vi-VN')} đ</td>
                    <td>{this.getStatusText(c.Status)}</td>
                    <td>
                      <button className="btn btn-edit" onClick={()=>this.handleEdit(c)} style={{marginRight:4}}>Sửa</button>
                      <button className="btn btn-delete" onClick={()=>this.handleDelete(c.Id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="card">
          <h3>{editingId ? "Sửa Hợp đồng" : "Thêm Hợp đồng"}</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input name="contractNo" placeholder="Số hợp đồng" value={formData.contractNo} onChange={this.handleInputChange} required />
            </div>
            <div className="form-row">
              <select name="partnerId" value={formData.partnerId} onChange={this.handleInputChange}>
                <option value="">-- Chọn Đối tác (hoặc để trống) --</option>
                {partners.map(p => (
                  <option key={p.Id} value={p.Id}>{p.Name} ({p.Type})</option>
                ))}
              </select>
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
              <textarea name="note" placeholder="Ghi chú" value={formData.note} onChange={this.handleInputChange} rows={3} />
            </div>
            <div style={{display:"flex", gap:8}}>
              <button type="submit" className="btn">{editingId ? "Cập nhật" : "Lưu"}</button>
              {editingId && <button type="button" className="btn" style={{background:"#6b7280"}} onClick={this.resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Contracts;
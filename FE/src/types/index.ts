// Container Type
export interface IContainer {
  id: string;
  number: string;
  type: string;
  location: string;
  status: string;
}

// Cargo Type
export interface ICargo {
  id: string;
  description: string;
  weight: number;
  type: string;
  containerId: string;
}

// Invoice Type
export interface IInvoice {
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

// Partner Type
export interface IPartner {
  id: string;
  name: string;
  type: string;
  contact: string;
  status: string;
}

// Staff Type
export interface IStaff {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: string;
}

// Transport Type
export interface ITransport {
  id: string;
  refCode: string;
  containerId: string;
  vehicle: string;
  eta: string;
  status: string;
}

// Finance Type
export interface IFinance {
  id: string;
  containerId: string;
  baseCost: number;
  demDet: number;
  localCharge: number;
  extraCost: number;
  total: number;
}

// Contract Type
export interface IContract {
  id: string;
  contractNo: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  note: string;
}

export default IContainer;
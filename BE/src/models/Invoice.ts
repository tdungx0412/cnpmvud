import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  invoiceNo: { type: String, required: true, unique: true },
  contractId: { type: String, required: true },
  containerId: { type: String, required: true },
  partnerName: { type: String, required: true },
  issueDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true, default: 10 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['unpaid', 'paid', 'overdue'], required: true },
  paidDate: { type: String, default: '' },
  note: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
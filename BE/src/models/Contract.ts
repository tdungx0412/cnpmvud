import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  contractNo: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema({
  contractNo: { type: String, required: true, unique: true },
  partnerName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'signed'], required: true },
  note: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IContract>('Contract', ContractSchema);
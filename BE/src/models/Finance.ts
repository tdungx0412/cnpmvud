import mongoose, { Schema, Document } from 'mongoose';

export interface IFinance extends Document {
  containerId: string;
  baseCost: number;
  demDet: number;
  localCharge: number;
  extraCost: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const FinanceSchema: Schema = new Schema({
  containerId: { type: String, required: true },
  baseCost: { type: Number, required: true, default: 0 },
  demDet: { type: Number, required: true, default: 0 },
  localCharge: { type: Number, required: true, default: 0 },
  extraCost: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model<IFinance>('Finance', FinanceSchema);
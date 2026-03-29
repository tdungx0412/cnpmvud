import mongoose, { Schema, Document } from 'mongoose';

export interface ITransport extends Document {
  refCode: string;
  containerId: string;
  vehicle: string;
  eta: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransportSchema: Schema = new Schema({
  refCode: { type: String, required: true },
  containerId: { type: String, required: true },
  vehicle: { type: String, required: true },
  eta: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], required: true }
}, { timestamps: true });

export default mongoose.model<ITransport>('Transport', TransportSchema);
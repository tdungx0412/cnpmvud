import mongoose, { Schema, Document } from 'mongoose';

export interface ICargo extends Document {
  description: string;
  weight: number;
  type: string;
  containerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CargoSchema: Schema = new Schema({
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  type: { type: String, enum: ['General', 'Reefer', 'Dangerous'], required: true },
  containerId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ICargo>('Cargo', CargoSchema);
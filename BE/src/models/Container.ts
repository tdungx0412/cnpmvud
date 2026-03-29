import mongoose, { Schema, Document } from 'mongoose';

export interface IContainer extends Document {
  number: string;
  type: string;
  location: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContainerSchema: Schema = new Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['20DC', '40HC', 'REEFER', 'OPEN_TOP'], required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['empty', 'loaded', 'in_transit', 'maintenance'], required: true }
}, { timestamps: true });

export default mongoose.model<IContainer>('Container', ContainerSchema);
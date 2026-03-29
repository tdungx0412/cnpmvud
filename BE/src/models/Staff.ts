import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  role: string;
  contact: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['driver', 'coordinator', 'warehouse', 'accountant', 'cskh', 'other'], required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true }
}, { timestamps: true });

export default mongoose.model<IStaff>('Staff', StaffSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
  name: string;
  type: string;
  contact: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['sender', 'receiver', 'carrier', 'forwarder'], required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true }
}, { timestamps: true });

export default mongoose.model<IPartner>('Partner', PartnerSchema);
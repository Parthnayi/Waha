import { Schema, model } from 'mongoose';

const ContactSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  phoneNumber: { type: String, required: true },
  name: { type: String },
  labels: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Contact = model('Contact', ContactSchema);
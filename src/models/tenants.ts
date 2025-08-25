import { Schema, model } from 'mongoose';

const TenantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Tenant = model('Tenant', TenantSchema);
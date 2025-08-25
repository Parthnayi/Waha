import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String },
  email: { type: String },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ tenantId: 1, username: 1 }, { unique: true });

export const User = model('User', UserSchema);
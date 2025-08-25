import { Schema, model } from 'mongoose';

const ChatGroupSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  waGroupId: { type: String, required: true },
  name: { type: String, required: true },
  participants: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const ChatGroup = model('ChatGroup', ChatGroupSchema);



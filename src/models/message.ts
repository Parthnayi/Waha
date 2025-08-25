import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: String, required: true }, 
  to: { type: String, required: true }, 
  content: { type: String, required: true },
  direction: { type: String, enum: ['in', 'out'], required: true },
  messageType: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

export const Message = model('Message', MessageSchema);
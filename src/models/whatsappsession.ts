import { Schema, model } from 'mongoose';

const WhatsAppSessionSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  status: { type: String, enum: ['connected', 'disconnected'], default: 'disconnected' },
  qrCode: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export const WhatsAppSession = model('WhatsAppSession', WhatsAppSessionSchema);
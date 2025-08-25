import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true, enum: ['Admin', 'Editor', 'Viewer'] },
  permissions: [{ type: String, required: true }] 
});

export const Group = model('Group', GroupSchema);
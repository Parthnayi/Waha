import { Types } from 'mongoose';
import type { Request } from 'express';

export interface UserRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    userId: string;
    username: string;
    tenantId: Types.ObjectId;
    groupId: Types.ObjectId;
    permissions?: string[];
  }
}

export interface TokenPayload {
  userId: string;
  tenantId: string;
  groupId: string;
}

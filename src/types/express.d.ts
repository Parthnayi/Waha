import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        userId: string;
        username: string;
        tenantId: any;
        groupId: any;
        permissions?: string[];
      }
    }
  }
}

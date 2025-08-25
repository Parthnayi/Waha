import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../models/user.js';
import type { TokenPayload } from '../types/types.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = await User.findById(decoded.userId).populate('groupId');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = {
      _id: user._id,
      userId: user._id.toString(),
      username: user.username,
      tenantId: new Types.ObjectId(decoded.tenantId),
      groupId: new Types.ObjectId(decoded.groupId),
      permissions: typeof user.groupId === 'object' && 'permissions' in user.groupId 
        ? (user.groupId as any).permissions 
        : []
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

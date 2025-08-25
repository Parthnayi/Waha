import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-123';

if (!process.env.JWT_SECRET) {
  console.log('JWT_SECRET not set in environment variables.');
}

interface TokenPayload {
  userId: string;
  tenantId: string;
  groupId: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: 86400 
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

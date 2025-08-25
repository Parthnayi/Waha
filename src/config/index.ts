import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/waha',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  wahaBaseUrl: process.env.WAHA_BASE_URL || 'http://localhost:3000',
  wahaApiKey: process.env.WAHA_API_KEY || '',
  wahaApiKeyHeader: process.env.WAHA_API_KEY_HEADER || 'X-API-KEY',
} as const;

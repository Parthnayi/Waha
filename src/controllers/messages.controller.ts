import type { Request, Response } from 'express';
import { Message } from '../models/message.js';

export const listMessages = async (req: Request, res: Response) => {
  try {
    const { limit = '50' } = req.query as { limit?: string };
    const tenantId = req.user?.tenantId;
    const messages = await Message.find({ tenantId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));
    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get messages', error });
  }
};



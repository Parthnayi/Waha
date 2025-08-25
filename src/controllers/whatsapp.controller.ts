import type { Request, Response } from 'express';
import { WhatsAppSession } from '../models/whatsappsession.js';
import { Message } from '../models/message.js';
import { config } from '../config/index.js';

async function callWaha(path: string, options: RequestInit = {}) {
  const url = `${config.wahaBaseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(config.wahaApiKey ? { [config.wahaApiKeyHeader]: config.wahaApiKey } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`WAHA error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { label } = req.body;
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    if (!tenantId || !userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const result = await callWaha('/sessions/create', {
      method: 'POST',
      body: JSON.stringify({ label }),
    });

    const sessionId = result.sessionId || result.id || label;
    const qrCode = result.qr || result.qrCode || null;

    const saved = await WhatsAppSession.create({
      tenantId,
      userId,
      sessionId,
      status: 'disconnected',
      qrCode,
    });

    return res.status(201).json({ success: true, session: saved, qr: qrCode });
  } catch (error) {
    console.error('WAHA createDevice error:', error);
    const details = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, message: 'Failed to create device', details });
  }
};

export const listDevices = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const sessions = await WhatsAppSession.find({ tenantId });
    return res.json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to list devices', error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, to, content, messageType } = req.body as { sessionId: string; to: string; content: string; messageType?: 'text'|'image'|'video' };
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    if (!tenantId || !userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!sessionId || !to || !content) return res.status(400).json({ success: false, message: 'sessionId, to, content are required' });

    const session = await WhatsAppSession.findOne({ tenantId, sessionId });
    if (!session) {
      return res.status(403).json({ success: false, message: 'Invalid session for this tenant' });
    }

    const result = await callWaha('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ sessionId, to, message: content, type: messageType || 'text' }),
    });

    const logged = await Message.create({
      tenantId,
      userId,
      deviceId: sessionId,
      to,
      content,
      direction: 'out',
      messageType: messageType || 'text',
      status: 'sent',
    });

    return res.json({ success: true, result, message: logged });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send message', error });
  }
};



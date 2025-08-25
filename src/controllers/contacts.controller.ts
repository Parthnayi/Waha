import type { Request, Response } from 'express';
import { Contact } from '../models/contact.js';
import { config } from '../config/index.js';

async function callWaha(path: string, options: RequestInit = {}) {
  const url = `${config.wahaBaseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`WAHA error ${res.status}`);
  return res.json();
}

export const listContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find({ tenantId: req.user?.tenantId });
    return res.json({ success: true, contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get contacts', error });
  }
};

export const syncContacts = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query as { sessionId?: string };
    if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId is required' });

    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    const { WhatsAppSession } = await import('../models/whatsappsession.js');
    const session = await WhatsAppSession.findOne({ tenantId, sessionId });
    if (!session) return res.status(403).json({ success: false, message: 'Invalid session for this tenant' });

    const result = await callWaha(`/contacts?sessionId=${encodeURIComponent(sessionId)}`);

    const contacts = (result.contacts || result || []).map((c: any) => ({
      tenantId,
      userId,
      phoneNumber: c.phone || c.id || c.number,
      name: c.name || c.pushname || '',
      labels: [],
    }));

    await Contact.deleteMany({ tenantId });
    const inserted = await Contact.insertMany(contacts);

    return res.json({ success: true, count: inserted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to sync contacts', error });
  }
};



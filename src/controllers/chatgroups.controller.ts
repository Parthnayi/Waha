import type { Request, Response } from "express";
import { ChatGroup } from "../models/waChatGroup.js";
import { config } from "../config/index.js";

async function callWaha(path: string, options: RequestInit = {}) {
  const url = `${config.wahaBaseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`WAHA error ${res.status}`);
  return res.json();
}

export const listChatGroups = async (req: Request, res: Response) => {
  try {
    const groups = await ChatGroup.find({ tenantId: req.user?.tenantId });
    return res.json({ success: true, groups });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get groups", error });
  }
};

export const syncChatGroups = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query as { sessionId?: string };
    if (!sessionId)
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });

    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    const { WhatsAppSession } = await import('../models/whatsappsession.js');
    const session = await WhatsAppSession.findOne({ tenantId, sessionId });
    if (!session) {
      return res.status(403).json({ success: false, message: 'Invalid session for this tenant' });
    }

    const result = await callWaha(
      `/groups?sessionId=${encodeURIComponent(sessionId)}`
    );

    const groups = (result.groups || result || []).map((g: any) => ({
      tenantId,
      userId,
      waGroupId: g.id,
      name: g.name || g.subject || "",
      participants: g.participants?.map((p: any) => p.id) || [],
    }));

    await ChatGroup.deleteMany({ tenantId });
    const inserted = await ChatGroup.insertMany(groups);

    return res.json({ success: true, count: inserted.length });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to sync groups", error });
  }
};

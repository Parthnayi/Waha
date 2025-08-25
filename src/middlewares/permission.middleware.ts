import type { Request, Response, NextFunction } from "express";
import { Group } from "../models/group.js";

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const group = await Group.findById(req.user?.groupId);
    if (!group) return res.status(403).json({ message: "No group found" });

    if (!group.permissions.includes(permission)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

import type { Request, Response } from "express";
import { User } from "../models/user.js";
import { Group } from "../models/group.js";
import { hashPassword } from "../utils/hash.js";
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not found",
      });
    }

    const { username, password, fullName, email, groupId } = req.body;

    if (!username || !password || !groupId) {
      return res.status(400).json({
        success: false,
        message: "Please enter required fields",
        required: ["username", "password", "groupId"],
      });
    }

    const existingUser = await User.findOne({
      username,
      tenantId: req.user.tenantId,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists in this tenant",
      });
    }

    const group = await Group.findOne({ _id: groupId, tenantId: req.user.tenantId });
    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Invalid group for this tenant",
      });
    }

    const hashed = await hashPassword(password);

    const user = new User({
      tenantId: req.user.tenantId,
      username,
      password: hashed,
      fullName,
      email,
      groupId,
    });

    await user.save();

    const userResponse = user.toObject();
    const { password: _password, ...userWithoutPassword } = userResponse as any;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      details: error,
    });
  }
};

export const assignGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { groupId } = req.body;

    const user = await User.findOne({ _id: id, tenantId: req.user?.tenantId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.groupId = groupId;
    await user.save();

    const group = await Group.findOne({ _id: groupId, tenantId: req.user?.tenantId });
    if (!group) {
      return res.status(400).json({ success: false, message: "Invalid group for this tenant" });
    }

    return res.json({ success: true, message: "Group assigned", user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ tenantId: req.user?.tenantId }).populate(
      "groupId"
    );
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

export const listGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find({ tenantId: req.user?.tenantId });
    return res.json(groups);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

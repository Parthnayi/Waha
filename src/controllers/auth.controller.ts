import type { Request, Response } from "express";
import { User, Group } from "../models/index.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success:false, message: "Username and password are required" });
    }

    const query: any = { username };
    if (req.body?.tenantId) {
      query.tenantId = req.body.tenantId;
    }
    const user = await User.findOne(query).populate("groupId").catch(err => {
      console.error("Database query error:", err);
      throw err;
    });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await comparePassword(password, user.password);
   
    if (!isValid)
    {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    console.log("User", user);
    
    const token = generateToken({
      userId: user._id.toString(),
      tenantId: user.tenantId.toString(),
      groupId: user.groupId._id.toString(),
    });
    console.log("Token", token);
    

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: typeof user.groupId === "object" && "name" in user.groupId ? (user.groupId as any).name : " ",
        permissions: typeof user.groupId === "object" && "permissions" in user.groupId ? (user.groupId as any).permissions : [""],
      },
    });
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.stack : error);
    return res.status(500).json({ 
      message: "Server error", 
      details: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { 
      username, 
      password, 
      fullName, 
      email, 
      tenantId, 
      groupId 
    } = req.body;

    if (!username || !password || !tenantId || !groupId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["username", "password", "tenantId", "groupId"]
      });
    }

    const group = await Group.findOne({ _id: groupId, tenantId });
    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Invalid group for this tenant"
      });
    }

    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      tenantId,
      groupId,
    });

    await newUser.save();

    console.log("New user created:", newUser);
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      details: error
    });
  }
};

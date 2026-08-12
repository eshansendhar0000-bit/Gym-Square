import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body);

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!expectedUsername || !expectedPassword || !secret) {
    console.error("Admin credentials or JWT_SECRET are not configured in the environment");
    throw new ApiError(500, "Server misconfiguration. Contact the administrator.");
  }

  // Constant-time-ish comparison isn't critical here since this is a
  // single-admin login, but we avoid short-circuit string leakage by
  // comparing both fields regardless of outcome.
  const validUsername = username === expectedUsername;
  const validPassword = password === expectedPassword;

  if (!validUsername || !validPassword) {
    throw new ApiError(401, "Invalid username or password");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "8h") as jwt.SignOptions["expiresIn"];
  const token = jwt.sign({ role: "admin", username }, secret, { expiresIn });

  res.json({ success: true, token });
});

export const adminSession = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, admin: req.admin });
});

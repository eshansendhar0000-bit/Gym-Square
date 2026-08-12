import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { DuplicateMemberError } from "../services/memberService";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Resource not found" });
}

// Express requires exactly 4 params for an error-handling middleware.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof DuplicateMemberError) {
    return res.status(409).json({ success: false, message: err.message });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  // Unexpected error — never leak stack traces or internals.
  console.error(err);
  const isProd = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
    ...(isProd ? {} : { detail: err instanceof Error ? err.message : String(err) }),
  });
}

export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(
  fn: T
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

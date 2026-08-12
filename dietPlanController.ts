import type { Request, Response } from "express";
import { FitnessAim } from "@prisma/client";
import { getAllDietPlans, getDietPlanForAim } from "../services/dietPlanService";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const listDietPlans = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, dietPlans: getAllDietPlans() });
});

export const getDietPlan = asyncHandler(async (req: Request, res: Response) => {
  const aim = req.params.aim?.toUpperCase();
  if (!aim || !(aim in FitnessAim)) {
    throw new ApiError(400, "Unknown fitness aim");
  }
  res.json({ success: true, dietPlan: getDietPlanForAim(aim as FitnessAim) });
});

import type { Request, Response } from "express";
import { memberCreateSchema, memberQuerySchema } from "../validators/memberValidator";
import * as memberService from "../services/memberService";
import { getDietPlanForAim } from "../services/dietPlanService";
import { ApiError, asyncHandler } from "../middleware/errorHandler";

function toPublicMember(member: Awaited<ReturnType<typeof memberService.getMemberById>>) {
  if (!member) return null;
  // Deliberately shape the response — don't leak raw DB internals by
  // default even though this model has no sensitive fields today.
  return {
    id: member.id,
    name: member.name,
    age: member.age,
    gender: member.gender,
    aim: member.aim,
    mobileNumber: member.mobileNumber,
    email: member.email,
    createdAt: member.createdAt,
  };
}

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const input = memberCreateSchema.parse(req.body);
  const member = await memberService.createMember(input);
  const dietPlan = getDietPlanForAim(member.aim);

  res.status(201).json({
    success: true,
    message:
      "Your registration has been submitted successfully. Gym Square will contact you regarding your training plan.",
    member: { id: member.id },
    dietPlan,
  });
});

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const query = memberQuerySchema.parse(req.query);
  const result = await memberService.listMembers(query);

  res.json({
    success: true,
    members: result.items.map(toPublicMember),
    pagination: {
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / result.pageSize)),
    },
  });
});

export const getMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await memberService.getMemberById(req.params.id);
  if (!member) {
    throw new ApiError(404, "Member not found");
  }
  res.json({ success: true, member: toPublicMember(member) });
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const existing = await memberService.getMemberById(req.params.id);
  if (!existing) {
    throw new ApiError(404, "Member not found");
  }
  const input = memberCreateSchema.partial().parse(req.body);
  const updated = await memberService.updateMember(req.params.id, input);
  res.json({ success: true, message: "Member updated successfully", member: toPublicMember(updated) });
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const existing = await memberService.getMemberById(req.params.id);
  if (!existing) {
    throw new ApiError(404, "Member not found");
  }
  await memberService.deleteMemberById(req.params.id);
  res.json({ success: true, message: "Member deleted successfully" });
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await memberService.getMemberStats();
  res.json({ success: true, stats });
});

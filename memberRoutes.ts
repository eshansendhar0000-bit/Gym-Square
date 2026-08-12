import { Router } from "express";
import * as memberController from "../controllers/memberController";
import { requireAdmin } from "../middleware/auth";
import { registrationLimiter } from "../middleware/rateLimiter";

const router = Router();

// Public: submit a registration
router.post("/", registrationLimiter, memberController.createMember);

// Admin-only: manage members
router.get("/", requireAdmin, memberController.listMembers);
router.get("/:id", requireAdmin, memberController.getMember);
router.put("/:id", requireAdmin, memberController.updateMember);
router.delete("/:id", requireAdmin, memberController.deleteMember);

export default router;

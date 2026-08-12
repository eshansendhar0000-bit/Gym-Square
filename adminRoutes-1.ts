import { Router } from "express";
import * as adminController from "../controllers/adminController";
import * as memberController from "../controllers/memberController";
import { requireAdmin } from "../middleware/auth";
import { adminLoginLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", adminLoginLimiter, adminController.adminLogin);
router.get("/session", requireAdmin, adminController.adminSession);
router.get("/stats", requireAdmin, memberController.getStats);

export default router;

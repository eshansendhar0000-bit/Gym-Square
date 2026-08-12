import { Router } from "express";
import * as dietPlanController from "../controllers/dietPlanController";

const router = Router();

router.get("/", dietPlanController.listDietPlans);
router.get("/:aim", dietPlanController.getDietPlan);

export default router;

import { Router } from "express";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { getAdminAnalytics, getEmployeeAnalytics } from "./dashboard.controller";

const router = Router();
router.get("/analytics", roleMiddleware(["admin"]), getAdminAnalytics);
router.get("/employeeAnalytics", getEmployeeAnalytics);

export default router;

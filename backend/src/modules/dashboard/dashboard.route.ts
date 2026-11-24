import { Router } from "express";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import {
  getAdminAnalytics,
  getAdminResourceAnalytics,
  getAdminUserAnalytics,
  getEmployeeAnalytics,
} from "./dashboard.controller";

const router = Router();
router.get(
  "/analytics/resources",
  roleMiddleware(["admin"]),
  getAdminResourceAnalytics,
);
router.get(
  "/analytics/users",
  roleMiddleware(["admin"]),
  getAdminUserAnalytics,
);
router.get("/analytics", roleMiddleware(["admin"]), getAdminAnalytics);
router.get("/employeeAnalytics", getEmployeeAnalytics);

export default router;

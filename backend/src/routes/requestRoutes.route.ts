import Router from "express";
import { roleMiddleware } from "../middleware/roleMIddleware";
import {
  getAllRequest,
  getSpecificRequest,
  createRequest,
  handleApprove,
  handleCancel,
  handleReject,
  handleForward,
} from "../controller/requestControllers.controller";
const router = Router();
router.get("/requests", roleMiddleware(["employee", "manager"]), getAllRequest);
router.get("/requests/:id", roleMiddleware(["manager"]), getSpecificRequest);
router.post("/requests", roleMiddleware(["employee"]), createRequest);
router.post(
  "/requests/:id/approve",
  roleMiddleware(["manager", "admin"]),
  handleApprove,
);
router.post(
  "/requests/:id/reject",
  roleMiddleware(["manager", "admin"]),
  handleReject,
);
router.post(
  "/requests/:id/forward",
  roleMiddleware(["manager"]),
  handleForward,
);
router.post("/requests/:id/cancel", roleMiddleware(["employee"]), handleCancel);
export default router;

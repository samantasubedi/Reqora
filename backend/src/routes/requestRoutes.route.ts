import Router from "express";
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
router.get("/requests", getAllRequest);
router.get("/requests/:id", getSpecificRequest);
router.post("/requests", createRequest);
router.post("/requests/:id/approve", handleApprove);
router.post("/requests/:id/reject", handleReject);
router.post("/requests/:id/forward", handleForward);
router.post("/requests/:id/cancel", handleCancel);
export default router;

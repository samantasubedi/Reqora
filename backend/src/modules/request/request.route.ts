import Router from "express";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import {
  getAllRequest,
  getSpecificRequest,
  createRequest,
  handleReview,
  handleCancel,
  handleForward,
} from "./request.controller";
const router = Router();
router.get("/requests",roleMiddleware(["admin"]), getAllRequest);
router.get("/myRequests",)
router.get("/requests/:id", roleMiddleware(["manager"]), getSpecificRequest);
router.post("/requests", roleMiddleware(["employee"]), createRequest);
router.post(
  "/requests/review",
  roleMiddleware(["manager", "admin"]),
  handleReview,
);

router.post(
  "/requests/:id/forward",
  roleMiddleware(["manager"]),
  handleForward,
);
router.post("/requests/:id/cancel", roleMiddleware(["employee"]), handleCancel);
export default router;

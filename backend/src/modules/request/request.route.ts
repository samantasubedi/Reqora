import Router from "express";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import {
  getAllRequest,
  getSpecificRequest,
  createRequest,
  handleReview,
  handleCancel,
  handleForward,
  getMyRequest,
} from "./request.controller";
import { validate } from "../../middleware/validationMiddleware";
import { create } from "node:domain";
import { createRequestSchema } from "./request.schema";
const router = Router();
router.get("/requests", roleMiddleware(["admin"]), getAllRequest);
router.get("/myRequests", getMyRequest);
router.get(
  "/requests/:id",
  roleMiddleware(["manager", "admin"]),
  getSpecificRequest,
);
router.post(
  "/requests",
  roleMiddleware(["employee"]),
  validate(createRequestSchema),
  createRequest,
);
router.post(
  "/requests/:id/review",
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

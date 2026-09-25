import Router from "express";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { getLogs } from "./log.controller";

const router = Router();
router.get("/logs", roleMiddleware(["admin"]), getLogs);
export default router;
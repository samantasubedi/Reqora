import { Router } from "express";
import {
  createCompany,
  generateCode,
  inviteToCompany,
  joinCompany,
  leaveCompany,
} from "../controller/companyControllers.controller";
import { roleMiddleware } from "../middleware/roleMIddleware";

const router = Router();
router.post("/createcompany", createCompany);
router.post("/invite/emailInvite",roleMiddleware(["admin"]), inviteToCompany);
router.post("/invite/generateCode",roleMiddleware(["admin"]),generateCode)
router.post("/join", joinCompany);
router.post("/leave", leaveCompany);
export default router;

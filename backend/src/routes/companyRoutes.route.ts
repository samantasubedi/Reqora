import { Router } from "express";
import {
  createCompany,
  generateCode,
  inviteToCompany,
  joinByCode,
  joinByEmail,
  leaveCompany,
} from "../controller/companyControllers.controller";
import { roleMiddleware } from "../middleware/roleMIddleware";

const router = Router();
router.post("/createcompany", createCompany);
router.post("/invite/emailInvite", roleMiddleware(["admin"]), inviteToCompany);
router.post("/invite/generateCode", roleMiddleware(["admin"]), generateCode);
router.post("/join/byEmail", joinByEmail);
router.post("/join/byCode", joinByCode);
router.post("/leave", leaveCompany);
export default router;


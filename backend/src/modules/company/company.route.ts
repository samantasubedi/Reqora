import { Router } from "express";
import {
  createCompany,
  generateCode,
  inviteToCompany,
  joinByCode,
  joinByEmail,
  leaveCompany,
} from "./company.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { validate } from "../../middleware/validationMiddleware";
import { createCompanySchema, emailInviteSchema } from "./company.schema";

const router = Router();
router.post("/createcompany", validate(createCompanySchema), createCompany);
router.post(
  "/invite/emailInvite",
  roleMiddleware(["admin"]),
  validate(emailInviteSchema),
  inviteToCompany,
);
router.post("/invite/codeInvite", roleMiddleware(["admin"]), generateCode);
router.post("/join/byEmail", joinByEmail);
router.post("/join/byCode", joinByCode);
router.post("/leave", leaveCompany);
export default router;

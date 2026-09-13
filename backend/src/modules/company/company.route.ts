import { Router } from "express";
import {
  createCompany,
  generateCode,
  getAnalytics,
  inviteToCompany,
  joinByCode,
  joinByEmail,
  leaveCompany,
} from "./company.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { validate } from "../../middleware/validationMiddleware";
import {
  createCompanySchema,
  emailInviteSchema,
  generateCodeSchema,
  joinByCodeSchema,
  joinByEmailSchema,
} from "./company.schema";

const router = Router();
router.post("/createcompany", validate(createCompanySchema), createCompany);
router.post(
  "/invite/emailInvite",
  roleMiddleware(["admin"]),
  validate(emailInviteSchema),
  inviteToCompany,
);
router.post(
  "/invite/codeInvite",
  roleMiddleware(["admin"]),
  validate(generateCodeSchema),
  generateCode,
);
router.post("/join/byEmail", validate(joinByEmailSchema), joinByEmail);
router.post("/join/byCode", validate(joinByCodeSchema), joinByCode);
router.post("/leave", leaveCompany);
router.get("/analytics", roleMiddleware(["admin"]), getAnalytics);

export default router;

import { Router } from "express";
import {
  createCompany,
  generateCode,
  inviteToCompany,
  joinByCode,
  joinByEmail,
  leaveCompany,
  getDepartments,
  addDepartment,
  getCompany,
  updateCompany,
  updateDepartment,
  deleteDepartment,
} from "./company.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { validate } from "../../middleware/validationMiddleware";
import {
  createCompanySchema,
  emailInviteSchema,
  generateCodeSchema,
  joinByCodeSchema,
  joinByEmailSchema,
  addDepartmentSchema,
  updateCompanySchema,
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
router.get("/departments", getDepartments);
router.post(
  "/departments",
  roleMiddleware(["admin"]),
  validate(addDepartmentSchema),
  addDepartment,
);
router.patch(
  "/departments/:id",
  roleMiddleware(["admin"]),
  validate(addDepartmentSchema),
  updateDepartment,
);
router.delete(
  "/departments/:id",
  roleMiddleware(["admin"]),
  deleteDepartment,
);
router.get("/company", roleMiddleware(["admin"]), getCompany);
router.patch(
  "/company",
  roleMiddleware(["admin"]),
  validate(updateCompanySchema),
  updateCompany,
);

export default router;

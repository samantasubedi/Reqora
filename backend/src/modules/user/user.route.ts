import { Router } from "express";
import {
  getAllUsers,
  getSpecificUser,
  updateUserByAdmin,
  deleteUser,
  deleteAllusers,
  getProfileInfo,
  updateProfile,
  changePassword,
} from "./user.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { parseQueryFilters } from "../../middleware/queryMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./user.schema";
const router = Router();
router.get("/profile",parseQueryFilters, getProfileInfo);
router.patch("/profile", validate(updateProfileSchema), updateProfile);
router.patch(
  "/profile/password",
  validate(changePasswordSchema),
  changePassword,
);
router.get("/users", parseQueryFilters, getAllUsers);
router.get("/users/:id", getSpecificUser);
router.patch("/users/:id", roleMiddleware(["admin"]), updateUserByAdmin);
router.delete("/users/:id", roleMiddleware(["admin"]), deleteUser);
router.delete("/users", deleteAllusers);
export default router;

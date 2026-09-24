import { Router } from "express";
import {
  getAllUsers,
  getSpecificUser,
  updateUserByAdmin,
  deleteUser,
  deleteAllusers,
  getProfileInfo,
} from "./user.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { parseQueryFilters } from "../../middleware/queryMiddleware";
const router = Router();
router.get("/profile",parseQueryFilters, getProfileInfo);
router.get("/users", parseQueryFilters, getAllUsers);
router.get("/users/:id", getSpecificUser);
router.patch("/users/:id", roleMiddleware(["admin"]), updateUserByAdmin);
router.delete("/users/:id", roleMiddleware(["admin"]), deleteUser);
router.delete("/users", deleteAllusers);
export default router;

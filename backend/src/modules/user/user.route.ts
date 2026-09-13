import { Router } from "express";
import {
  getAllUsers,
  getSpecificUser,
  changeUserRole,
  deleteAllusers,
  getProfileInfo,
} from "./user.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
import { parseQueryFilters } from "../../middleware/queryMiddleware";
const router = Router();
router.get("/profile",parseQueryFilters, getProfileInfo);
router.get("/users", parseQueryFilters, getAllUsers);
router.get("/users/:id", getSpecificUser);
router.patch("/users/:id", roleMiddleware(["admin"]), changeUserRole);
router.delete("/users", deleteAllusers);
export default router;

import { Router } from "express";
import {
  getAllUsers,
  getSpecificUser,
  changeUserRole,
//   deleteAllusers,
} from "../controller/userControllers.controller";
import { roleMiddleware } from "../middleware/roleMIddleware";
const router = Router();
router.get("/users", getAllUsers);
router.get("/users/:id", getSpecificUser);
router.patch("/users/:id", roleMiddleware(["admin"]),changeUserRole);
// router.delete("/users", deleteAllusers);
export default router;

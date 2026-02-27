import { Router } from "express";
import {
  getAllUsers,
  getSpecificUser,
  changeUserRole,
//   deleteAllusers,
} from "../controller/userControllers.controller";
const router = Router();
router.get("/users", getAllUsers);
router.get("/users/:id", getSpecificUser);
router.patch("/users/:id", changeUserRole);
// router.delete("/users", deleteAllusers);
export default router;

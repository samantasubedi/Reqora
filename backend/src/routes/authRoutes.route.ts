import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  handleLogout,
} from "../controller/authControllers.controller";
const router = Router();
router.post("/login", handleLogin);

router.post("/register", handleRegister);

router.post("/logout", handleLogout);
export default router;

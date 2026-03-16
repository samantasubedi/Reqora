import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefresh,
} from "../controller/authControllers.controller";
import { authMiddlware } from "../middleware/authMiddleware";
const router = Router();
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/logout",authMiddlware, handleLogout);
router.post("/refresh",handleRefresh)

export default router;

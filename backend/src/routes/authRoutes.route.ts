import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefresh,
  isLoggedIn,
} from "../controller/authControllers.controller";
import { authMiddlware } from "../middleware/authMiddleware";
const router = Router();
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/logout",authMiddlware, handleLogout);
router.post("/refresh",handleRefresh)
router.post("/isloggedin",isLoggedIn)
export default router;

import { Router } from "express";
import {
  Login,
  Register,
  Logout,
  Refresh,
  isLoggedIn,
} from "./authControllers.controller";
import { authMiddlware } from "../../middleware/authMiddleware";
const router = Router();
router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", authMiddlware, Logout);
router.post("/refresh", Refresh);
router.post("/isloggedin", isLoggedIn);
export default router;

import { Router } from "express";
import {
  Login,
  Register,
  Logout,
  Refresh,
  isLoggedIn,
} from "./auth.controller";
import { authMiddlware } from "../../middleware/authMiddleware";

import { registerSchema } from "./auth.schema";
import { validate } from "../../middleware/validationMiddleware";
const router = Router();
router.post("/login", Login);
router.post("/register",validate(registerSchema), Register);
router.post("/logout", authMiddlware, Logout);
router.post("/refresh", Refresh);
router.post("/isloggedin", isLoggedIn);
export default router;

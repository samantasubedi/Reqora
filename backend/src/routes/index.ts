import { Router } from "express";
import authRoutes from "./authRoutes.route";
import userRoutes from "./userRoutes.route";
import resourceRoutes from "./resourceRoutes.route";
import requestRoutes from "./requestRoutes.route";
import { authMiddlware } from "../middleware/authMiddleware";

const router = Router();
router.use(authRoutes);
router.use(authMiddlware,requestRoutes);
router.use(authMiddlware,resourceRoutes)
router.use(authMiddlware,userRoutes)
export default router;

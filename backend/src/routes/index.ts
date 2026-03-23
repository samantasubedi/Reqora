import { Router } from "express";
import authRoutes from "./authRoutes.route";
import userRoutes from "./userRoutes.route";
import resourceRoutes from "./resourceRoutes.route";
import requestRoutes from "./requestRoutes.route";
import companyRoutes from "./companyRoutes.route";
import { authMiddlware } from "../middleware/authMiddleware";

const router = Router();
router.use(authRoutes);
router.use(userRoutes);
router.use(authMiddlware, companyRoutes);
router.use(authMiddlware, requestRoutes);
router.use(authMiddlware, resourceRoutes);
export default router;

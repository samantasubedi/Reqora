import { Router } from "express";
import authRoutes from "./authRoutes.route";
import userRoutes from "./userRoutes.route";
import resourceRoutes from "./resourceRoutes.route";
import requestRoutes from "./requestRoutes.route";
const router = Router();
router.use(authRoutes, userRoutes, resourceRoutes, requestRoutes);
export default router;

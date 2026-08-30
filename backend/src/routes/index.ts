import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.route";
import userRoutes from "../modules/user/userRoutes.route";
import resourceRoutes from "../modules/resource/resourceRoutes.route";
import requestRoutes from "../modules/request/requestRoutes.route";
import companyRoutes from "../modules/company/companyRoutes.route";
import { authMiddlware } from "../middleware/authMiddleware";

const router = Router();
router.use(authRoutes);
router.use(authMiddlware, userRoutes);
router.use(authMiddlware, companyRoutes);
router.use(authMiddlware, requestRoutes);
router.use(authMiddlware, resourceRoutes);
export default router;

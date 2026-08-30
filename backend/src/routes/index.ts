import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import resourceRoutes from "../modules/resource/resource.route";
import requestRoutes from "../modules/request/request.route";
import companyRoutes from "../modules/company/company.route";
import { authMiddlware } from "../middleware/authMiddleware";

const router = Router();
router.use(authRoutes);
router.use(authMiddlware, userRoutes);
router.use(authMiddlware, companyRoutes);
router.use(authMiddlware, requestRoutes);
router.use(authMiddlware, resourceRoutes);
export default router;

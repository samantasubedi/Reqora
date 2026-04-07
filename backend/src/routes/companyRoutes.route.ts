import { Router } from "express";
import { createCompany, inviteToCompany ,joinCompany, leaveCompany} from "../controller/companyControllers.controller";

const router=Router()
router.post("/createcompany",createCompany)
router.post("/invite",inviteToCompany)
router.post("/join",joinCompany)
router.post("/leave",leaveCompany)
export default router
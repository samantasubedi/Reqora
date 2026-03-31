import { Router } from "express";
import { createCompany, inviteToCompany ,joinCompany} from "../controller/companyControllers.controller";

const router=Router()
router.post("/createcompany",createCompany)
router.post("/invite",inviteToCompany)
router.post("/join",joinCompany)
export default router
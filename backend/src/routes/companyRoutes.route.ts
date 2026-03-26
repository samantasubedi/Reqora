import { Router } from "express";
import { createCompany, inviteToCompany } from "../controller/companyControllers.controller";

const router=Router()
router.post("/createcompany",createCompany)
router.post("/invite",inviteToCompany)
export default router
import { Router } from "express";
import { createCompany } from "../controller/companyControllers.controller";

const router=Router()
router.post("/createcompany",createCompany)
export default router
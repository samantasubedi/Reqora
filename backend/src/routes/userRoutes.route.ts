import { Router } from "express";
import { getAllUsers,getSpecificUser,createUser,editUser } from "../controller/userControllers.controller";
const router=Router()
router.get("/users",getAllUsers);
router.get("/users/:id",getSpecificUser );
router.post("/users",createUser );
router.patch("/users/:id",editUser );
export default router
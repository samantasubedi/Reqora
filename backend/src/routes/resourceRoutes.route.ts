import { Router } from "express";
import {
  getAllResources,
  addResource,
  getSpecificResource,
  editResource,
  deleteResource,
} from "../controller/resourceControllers.controller";
const router = Router();
router.get("/resources", getAllResources);
router.get("/resources/:id", getSpecificResource);
router.post("/resources", addResource);
router.patch("/resources/:id", editResource);
router.delete("/resources/:id", deleteResource);
export default router;

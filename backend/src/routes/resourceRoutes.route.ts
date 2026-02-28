import { Router } from "express";
import {
  getAllResources,
  addResource,
  getSpecificResource,
  editResource,
  deleteResource,
} from "../controller/resourceControllers.controller";
import { roleMiddleware } from "../middleware/roleMIddleware";
const router = Router();
router.get("/resources", getAllResources);
router.get("/resources/:id", getSpecificResource);
router.post("/resources", roleMiddleware(["admin"]),addResource);
router.patch("/resources/:id", roleMiddleware(["admin"]),editResource);
router.delete("/resources/:id",roleMiddleware(["admin"]), deleteResource);
export default router;

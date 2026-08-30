import { Router } from "express";
import {
  getAllResources,
  addResource,
  getSpecificResource,
  editResource,
  deleteResource,
  releaseResource,
} from "./resource.controller";
import { roleMiddleware } from "../../middleware/roleMIddleware";
const router = Router();
router.get("/resources", getAllResources);
router.get("/resource/:id", getSpecificResource);
router.post("/resources/release", releaseResource);
router.post("/resources", roleMiddleware(["admin"]), addResource);
router.patch("/resources", roleMiddleware(["admin"]), editResource);
router.delete("/resources", roleMiddleware(["admin"]), deleteResource);
export default router;

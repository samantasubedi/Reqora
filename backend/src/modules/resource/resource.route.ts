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
import { parseQueryFilters } from "../../middleware/queryMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { releaseResourceSchema, ResourceSchema } from "./resource.schema";

const router = Router();
router.get("/resources", parseQueryFilters, getAllResources);
router.get("/resource/:id", parseQueryFilters, getSpecificResource);
router.post(
  "/resources/release",
  validate(releaseResourceSchema),
  releaseResource,
);
router.post(
  "/resources",
  roleMiddleware(["admin"]),
  validate(ResourceSchema),
  addResource,
);
router.patch(
  "/resources/:id",
  roleMiddleware(["admin"]),
  validate(ResourceSchema),
  editResource,
);
router.delete("/resources", roleMiddleware(["admin"]), deleteResource);

export default router;

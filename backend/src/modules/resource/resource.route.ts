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
import {
  addResourceSchema,
  editResourceSchema,
  releaseResourceSchema,
} from "./resource.schema";

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
  validate(addResourceSchema),
  addResource,
);
router.patch(
  "/resources",
  roleMiddleware(["admin"]),
  validate(editResourceSchema),
  editResource,
);
router.delete("/resources", roleMiddleware(["admin"]), deleteResource);

export default router;
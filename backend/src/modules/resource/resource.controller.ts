import { NextFunction, Request, Response } from "express";
import { ResourceStatus } from "../../generated/prisma/enums";
import { appError } from "../../utils/appError";
import {
  addResourceService,
  deleteResourceService,
  editResourceService,
  findAllResourcesService,
  getSpecificResourceService,
  releaseResourceService,
} from "./resource.service";
import { T_QueryFilters } from "../../middleware/queryMiddleware";

export const getAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const {
      skip,
      take,
      pageNumber,
      search,
      resourceTypeSearch,
      resourceDepartmentSearch,
      resourceAvailableQuantity,
    } = res.locals.query as T_QueryFilters;

    const {
      resources,
      countsByStatus,
      countsByType,
      totalPages,
      totalResources,
    } = await findAllResourcesService({
      companyId,
      search,
      resourceTypeSearch,
      resourceDepartmentSearch,
      availableQuantity: resourceAvailableQuantity,
      skip,
      take,
    });

    const allResources = resources.map((resource) => {
      const totalQuantity = resource.resourceItems.length;
      const availableQuantity = resource.resourceItems.filter(
        (item) => item.status === ResourceStatus.available,
      ).length;
      const inUseQuantity = resource.resourceItems.filter(
        (item) => item.status === ResourceStatus.inUse,
      ).length;
      const underMaintenanceQuantity = resource.resourceItems.filter(
        (item) => item.status === ResourceStatus.underMaintenance,
      ).length;
      const locations = [
        ...new Set(resource.resourceItems.map((item) => item.location)),
      ];

      return {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        department: resource.department?.name ?? null,
        location: locations.join(", "),
        availability: availableQuantity > 0,
        totalQuantity,
        availableQuantity,
        inUseQuantity,
        underMaintenanceQuantity,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      };
    });

    res.json({
      success: true,
      message: "got all resources",
      allResources,
      countsByStatus: [
        ...countsByStatus,
        { _count: totalResources, status: "all" },
      ],
      countsByType,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (err) {
    next(err);
  }
};

export const addResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    if (!companyId) {
      throw new appError(
        400,
        "USER_NOT_ENROLLED",
        "User does not belong to a company",
      );
    }
    const {
      resourceName,
      quantity,
      type,
      statusAssignment,
      locationAssignment,
      departmentId,
    } = req.body;
    const resource = await addResourceService({
      resourceName,
      quantity,
      type,
      statusAssignment,
      locationAssignment,
      departmentId,
      companyId,
    });

    return res.status(201).json({
      success: true,
      code: "RESOURCE_ADDED",
      message: "resource added successfully",
      data: resource,
    });
  } catch (err) {
    next(err);
  }
};

export const getSpecificResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new appError(400, "ID_NOT_FOUND", "please provide an id");
    }
    const companyId = res.locals.user.companyId;
    const { resourceStatus } = res.locals.query as T_QueryFilters;
    const resourceDetail = await getSpecificResourceService({
      id,
      companyId,
      status: resourceStatus,
    });

    return res.status(200).json({
      success: true,
      code: "SUCCESSFULL",
      message: "resource detail retrived successfully",
      resourceDetail,
    });
  } catch (err) {
    next(err);
  }
};

export const editResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const { id, name, type, departmentId, location, quantity } = req.body;
    await editResourceService({
      id,
      name,
      type,
      departmentId,
      location,
      quantity,
      companyId,
    });
    return res.status(201).json({
      message: "Resource updated successfully",
      code: "RESOURCE_UPDATED",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;
    const companyId = res.locals.user.companyId;
    if (!id) {
      throw new appError(400, "ID_NOT_FOUND", "please provide an id");
    }
    await deleteResourceService({ id, companyId });
    res.json({ message: "resource deleted successfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const releaseResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { resourceItemId } = req.body;
    const { email, companyId } = res.locals.user;
    await releaseResourceService({ resourceItemId, email, companyId });
    return res.json({
      success: true,
      code: "RESOURCE_RELEASED",
      message: "resource item released successfully",
    });
  } catch (err) {
    next(err);
  }
};
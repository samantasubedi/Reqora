import { NextFunction, Request, Response } from "express";
import { ResourceStatus } from "../generated/prisma/enums";
import { pageHelper } from "../utils/pageHelper";

export type T_QueryFilters = {
  // Shared
  search: string|undefined,
  skip: number;
  take: number;
  pageNumber: number;
  pageLimit: number;

  // Resource
  resourceStatus: ResourceStatus | undefined;
  resourceTypeSearch: string | undefined;
  resourceAvailableQuantity: number | undefined;
  resourceDepartmentSearch: string | undefined;
  //users
  
};

export const parseQueryFilters = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = req.query;
  const { skip, take, pageNumber, pageLimit } = pageHelper({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  const parsed: T_QueryFilters = {
    // Shared
    search: query.search ? String(query.search).trim() : undefined,
    skip,
    take,
    pageNumber,
    pageLimit,

    // Resource
    resourceStatus: query.resourceStatus
      ? (String(query.resourceStatus) as ResourceStatus)
      : undefined,
    resourceTypeSearch: query.resourceTypeSearch
      ? String(query.resourceTypeSearch)
      : undefined,

    resourceAvailableQuantity: query.resourceAvailableQuantity
      ? Number(query.resourceAvailableQuantity)
      : undefined,
    resourceDepartmentSearch: query.resourceDepartmentSearch
      ? String(query.resourceDepartmentSearch)
      : undefined,
  };

  res.locals.query = parsed;

  next();
};

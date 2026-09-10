import { NextFunction, Request, Response } from "express";
import { ResourceStatus } from "../generated/prisma/enums";
import { pageHelper } from "../utils/pageHelper";

export type T_QueryFilters = {
  // Shared
  search?: string;
  skip: number;
  take: number;
  pageNumber: number;
  pageLimit: number;

  // Resource
  resourceStatus: ResourceStatus | undefined;
  resourceType: string | undefined;
  resourceAvailability: boolean | undefined;
  resourceAvailableQuantity: number | undefined;
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
    resourceType: query.resourceType ? String(query.resourceType) : undefined,
    resourceAvailability: query.availability
      ? query.availability === "true"
      : undefined,
    resourceAvailableQuantity: query.availableQuantity
      ? Number(query.availableQuantity)
      : undefined,
  };

  res.locals.query = parsed;

  next();
};

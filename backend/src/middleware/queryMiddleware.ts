import { NextFunction, Request, Response } from "express";
import { ResourceStatus } from "../generated/prisma/enums";
import { pageHelper } from "../utils/pageHelper";

export type T_QueryFilters = {
  // Shared
  search?: string;
  skip: number;
  take: number;

  // Resource
  status: ResourceStatus | undefined;
  type: string | undefined;
  availability: boolean | undefined;
  availableQuantity: number | undefined;
};

export const parseQueryFilters = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = req.query;
  const { skip, take } = pageHelper({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  const parsed: T_QueryFilters = {
    // Shared
    search: query.search ? String(query.search).trim() : undefined,
    skip,
    take,

    // Resource
    status: query.resourceStatus
      ? (String(query.resourceStatus) as ResourceStatus)
      : undefined,
    type: query.resourceType ? String(query.resourceType) : undefined,
    availability: query.availability
      ? query.availability === "true"
      : undefined,
    availableQuantity: query.availableQuantity
      ? Number(query.availableQuantity)
      : undefined,
  };

  res.locals.query = parsed;

  next();
};

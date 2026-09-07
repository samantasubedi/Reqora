import { NextFunction, Request, Response } from "express";
import { ResourceStatus } from "../generated/prisma/enums";

export type T_QueryFilters = {
  search?: string;
  page: number;
  limit: number | undefined;

  // Resource
  resourceStatus: ResourceStatus | undefined;
};

export const parseQueryFilters = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = req.query;

  const parsed: T_QueryFilters = {
    // Shared
    search: query.search ? String(query.search).trim() : undefined,
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,

    // Resource
    resourceStatus: query.resourceStatus
      ? (String(query.resourceStatus) as ResourceStatus)
      : undefined,
  };

  res.locals.query = parsed;

  next();
};

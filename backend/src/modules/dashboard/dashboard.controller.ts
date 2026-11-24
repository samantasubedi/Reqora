import { NextFunction, Request, Response } from "express";
import { appError } from "../../utils/appError";
import {
  getAdminDashboardAnalyticsService,
  getAdminResourceAnalyticsService,
  getAdminUserAnalyticsService,
  getEmployeeDashboardService,
} from "./dashboard.service";
import { parseAnalyticsQuery } from "./dashboard.utils";

export const getAdminAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId } = res.locals.user;
    const { resourceStats, userStats } =
      await getAdminDashboardAnalyticsService({ companyId });
    return res.status(200).json({
      success: true,
      code: "ANALYTICS_FETCHED",
      message: "dashboard analytics fetched successfully",
      resourceStats,
      userStats,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminResourceAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId } = res.locals.user;
    const { from, to, tzOffsetMinutes, granularity } = parseAnalyticsQuery(
      req.query as Record<string, unknown>,
    );

    const resourceStats = await getAdminResourceAnalyticsService({
      companyId,
      from,
      to,
      tzOffsetMinutes,
      granularity,
    });

    return res.status(200).json({
      success: true,
      code: "RESOURCE_ANALYTICS_FETCHED",
      message: "resource analytics fetched successfully",
      resourceStats,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminUserAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId } = res.locals.user;
    const { from, to, tzOffsetMinutes, granularity } = parseAnalyticsQuery(
      req.query as Record<string, unknown>,
    );

    const userStats = await getAdminUserAnalyticsService({
      companyId,
      from,
      to,
      tzOffsetMinutes,
      granularity,
    });

    return res.status(200).json({
      success: true,
      code: "USER_ANALYTICS_FETCHED",
      message: "user analytics fetched successfully",
      userStats,
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, companyId } = res.locals.user;
    if (!companyId) {
      throw new appError(
        403,
        "USER_NOT_ENROLLED",
        "User does not belong to a company",
      );
    }
    const data = await getEmployeeDashboardService({
      username,
      email,
      companyId,
    });
    return res.status(200).json({
      success: true,
      code: "EMPLOYEE_ANALYTICS_FETCHED",
      message: "employee dashboard analytics fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

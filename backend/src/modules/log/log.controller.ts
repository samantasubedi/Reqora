import { NextFunction, Request, Response } from "express";
import { getLogsService } from "./log.service";

export const getLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const logs = await getLogsService({ companyId });
    return res.status(200).json({
      success: true,
      code: "LOGS_RETRIEVED",
      message: "logs retrieved successfully",
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};
import { NextFunction, Request, Response } from "express";
import { getLogsService } from "./log.service";

export const getLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const data = await getLogsService({ companyId, page, pageSize });
    return res.status(200).json({
      success: true,
      code: "LOGS_RETRIEVED",
      message: "logs retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};
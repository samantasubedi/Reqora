import { NextFunction, Request, Response } from "express";
import { appError } from "../utils/appError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof appError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "internal server error",
    });
  }
};

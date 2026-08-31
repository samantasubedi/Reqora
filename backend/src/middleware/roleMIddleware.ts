import { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError";
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInfo = res.locals.user;
      if (!userInfo) {
        throw new appError(400, "NOT_FOUND", "invalid or expired token");
      }
      if (allowedRoles.includes(userInfo.role)) {
        return next();
      }
      throw new appError(
        403,
        "FORBIDDEN",
        "user with this role cannot access this route",
      );
    } catch (err) {
      next(err);
    }
  };
};

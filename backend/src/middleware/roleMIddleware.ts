import { Request, Response, NextFunction } from "express";
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInfo = res.locals.user;
      // console.log("this is userInfo", userInfo);
      if (!userInfo) {
        return res.json({ message: "user not found" });
      }
      if (allowedRoles.includes(userInfo.role)) {
        return next();
      }
      return res.json({
        message: "Access denied, user with this role cannot access this route",
      });
    } catch (err) {
      return res.status(500).json({ message: "server error", error: err });
    }
  };
};

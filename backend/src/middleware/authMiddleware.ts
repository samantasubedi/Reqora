import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/setCookie";
import { refresh } from "../modules/auth/auth.service";
import { appError } from "../utils/appError";
export const authMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      const refreshToken:string = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new appError(401, "UNAUTHORIZED", "user is not authorized");
      } else if (refreshToken) {
        const { accessToken, newRefreshToken } = await refresh({refreshToken});
        if (accessToken && newRefreshToken) {
          setCookie(res, accessToken, newRefreshToken);
          return res.status(201).json({
            success: true,
            message: "your tokens has been regenerated",
            code: "TOKEN_REFRESHED",
          });
        }
      }
    } else if (accessToken) {
      const accessSecret = process.env.ACCESS_SECRET;
      let decodedData;
      if (accessSecret) {
        try {
          decodedData = jwt.verify(accessToken, accessSecret);
        } catch {
          throw new appError(400, "INVALID_TOKEN", "Invalid or expired token");
        }
        res.locals.user = decodedData;
        next();
      }
    }
  } catch (err) {
    next(err);
  }
};

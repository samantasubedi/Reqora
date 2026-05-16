import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { handleRefresh } from "../controller/authControllers.controller";
export const authMiddlware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({
          code: "UNAUTHORIZED_USER  ",
          message: "access and refresh token not found",
        });
      } else if (refreshToken) {
        handleRefresh(req, res);
      }
    } else if (accessToken) {
      const accessSecret = process.env.ACCESS_SECRET;
      if (accessSecret) {
        const decodedData = jwt.verify(accessToken, accessSecret);

        res.locals.user = decodedData;
        console.log("this is decoded data", decodedData);

        next();
      }
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Access denied, invalid token", error: err });
  }
};

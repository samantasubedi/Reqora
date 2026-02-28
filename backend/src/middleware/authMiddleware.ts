import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
export const authMiddlware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.header("Authorization");

    if (!accessToken) {
      const refreshSecret = process.env.REFRESH_SECRET;
      const accessSecret = process.env.ACCESS_SECRET;
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        console.log("refresh token not found");
      }
      console.log("this is refreshToken", refreshToken);
      if (refreshSecret && accessSecret) {
        const decodedData = jwt.verify(refreshToken, refreshSecret);
        const accessToken = jwt.sign(decodedData, accessSecret);
        return res.json({
          message: "access token have been regenerated",
          accessToken: accessToken,
        });
      }
    } else if (accessToken) {
      const accessSecret = process.env.ACCESS_SECRET;
      if (accessSecret) {
        const decodedData = jwt.verify(accessToken, accessSecret);

        res.locals.user = decodedData;
        // console.log("this is decoded data", decodedData);
        next();
      } else if (!accessSecret) {
        return res.json({ message: "accessSecret not found" });
      }
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Access denied, invalid token", error: err });
  }
};

import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const authMiddlware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
     return res.json({ message: "Token not found, Access denied" });
    } else if (token) {
      const accessSecret = process.env.ACCESS_SECRET;
      if (accessSecret) {
        const decodedData = jwt.verify(token, accessSecret);

        res.locals.user = decodedData;
        console.log(decodedData);
        next();
      } else if (!accessSecret) {
       return res.json({ message: "accessSecret not found" });
      }
    }
  } catch (err) {
  return  res.status(400).json({ message: "Access denied, invalid token", error: err });
  }
};

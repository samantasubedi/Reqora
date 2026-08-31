import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { loginUser, refresh, registerUser } from "./auth.service";
import { appError } from "../../utils/appError";
import { setCookie } from "../../utils/setCookie";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;
    const createdUser = await registerUser({ email, username, password });
    return res.status(201).json({
      success: true,
      code: "USER_REGISTERED",
      message: "user registered successfully",
      data: createdUser,
    });
  } catch (err) {
    next(err);
  }
};
export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser({
      username,
      password,
    });
    if (result) {
      const { user, accessToken, refreshToken } = result;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 15 * 60 * 1000, //15 minutes
      });
      return res.status(200).json({
        success: true,
        code: "LOGIN_SUCCESSFULL",
        message: `You have been logged in as ${username}`,
        role: user.role,
        username: user.username,
      });
    }
  } catch (err) {
    next(err);
  }
};
export const Logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken", {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });
    res.clearCookie("refreshToken", {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      code: "LOGOUT_SUCCESSFULL",
      message: "You have been successfully logged out !",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
export const Refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new appError(401, "TOKEN_NOT_FOUND", "Refresh token not found");
    }
    const { accessToken, newRefreshToken } = await refresh(refreshToken);

    setCookie(res, accessToken, newRefreshToken);
    return res.status(201).json({
      success: true,
      message: "your tokens has been regenerated",
      code: "TOKEN_REFRESHED",
    });
  } catch (err) {
    res.clearCookie("refreshToken", {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });
    next(err);
  }
};

export const isLoggedIn = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const accessSecret = process.env.ACCESS_SECRET!;
  if (!accessToken) {
    if (!refreshToken) {
      return res.status(200).json({
        code: "NOT_LOGGEDIN",
        message: "user is not logged in ",
      });
    }
    const { accessToken, newRefreshToken } = await refresh(refreshToken);

    setCookie(res, accessToken, newRefreshToken);
    return res.status(201).json({
      success: true,
      message: "your tokens has been regenerated",
      code: "TOKEN_REFRESHED",
    });
  }
  const userData = jwt.verify(accessToken, accessSecret) as JwtPayload;
  res.status(200).json({
    success: true,
    code: "LOGGEDIN",
    role: userData.role,
    username: userData.username,
    message: "user is logged in ",
  });
};

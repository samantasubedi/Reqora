import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { refresh } from "../../utils/refresh";
import { loginUser, registerUser } from "./auth.service";

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
export const Logout = (req: Request, res: Response) => {
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
    res.status(401).json({
      code: "LOGOUT_FAILED",
      message: "Couldn't log you out !",
      success: false,
    });
  }
};
export const Refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "refresh token not found",
      code: "TOKEN_NOT_FOUND",
    });
  }
  try {
    const { code, accessToken, NewRefreshToken } = await refresh(refreshToken);
    if (code === "USER_NOT_FOUND") {
      throw new Error("user not found");
    }
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", NewRefreshToken, {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "your access token has been regenerated",
      code: "TOKEN_REFRESHED",
    });
  } catch (err) {
    res.clearCookie("refreshToken", {
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    });
    return res.status(401).json({
      success: false,
      message: "invalid or expired refresh token",
      code: "INVALID_TOKEN",
    });
  }
};

export const isLoggedIn = (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const accessSecret = process.env.ACCESS_SECRET!;
  if (!accessToken) {
    if (!refreshToken) {
      return res.json({
        code: "NOT_LOGGEDIN",
        message: "the user is not logged in ",
      });
    }
    return Refresh(req, res);
  }
  const userData = jwt.verify(accessToken, accessSecret) as JwtPayload;
  res.json({
    code: "LOGGEDIN",
    role: userData.role,
    username: userData.username,
    message: "user is logged in ",
  });
};

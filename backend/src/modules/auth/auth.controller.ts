import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { loginUser, refresh, registerUser } from "./auth.service";
import { appError } from "../../utils/appError";
import { clearAuthCookies, setCookie } from "../../utils/setCookie";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;
    const createdUser = await registerUser({ email, username, password });
    const { passwordHash, ...safeUserData } = createdUser;
    return res.status(201).json({
      success: true,
      code: "USER_REGISTERED",
      message: "user registered successfully",
      data: safeUserData,
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

      setCookie(res, accessToken, refreshToken);
      return res.status(200).json({
        success: true,
        code: "LOGIN_SUCCESSFULL",
        message: `You have been logged in as ${username}`,
        id: user.id,
        role: user.role,
        username: user.username,
        email: user.email,
        companyId: user.companyId,
      });
    }
  } catch (err) {
    next(err);
  }
};
export const Logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    clearAuthCookies(res);
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
    const refreshToken:string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new appError(401, "TOKEN_NOT_FOUND", "Refresh token not found");
    }
    const { accessToken, newRefreshToken } = await refresh({refreshToken});

    setCookie(res, accessToken, newRefreshToken);
    return res.status(200).json({
      success: true,
      message: "your tokens has been regenerated",
      code: "TOKEN_REFRESHED",
    });
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
};

export const isLoggedIn = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const accessSecret = process.env.ACCESS_SECRET!;
  if (!accessToken) {
    if (!refreshToken) {
      return res.status(200).json({
        success: false,
        code: "NOT_LOGGEDIN",
        message: "user is not logged in ",
      });
    }
    const { accessToken, newRefreshToken } = await refresh({ refreshToken });

    setCookie(res, accessToken, newRefreshToken);
    return res.status(200).json({
      success: true,
      message: "your tokens has been regenerated",
      code: "TOKEN_REFRESHED",
    });
  }
  try {
    const userData = jwt.verify(accessToken, accessSecret) as JwtPayload;
    return res.status(200).json({
      success: true,
      code: "LOGGEDIN",
      id: userData.id ?? null,
      role: userData.role ?? null,
      username: userData.username,
      email: userData.email,
      companyId: userData.companyId ?? null,
      departmentId: userData.departmentId ?? null,
      message: "user is logged in ",
    });
  } catch {
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }
    try {
      const { accessToken: freshAccess, newRefreshToken } = await refresh({
        refreshToken,
      });
      setCookie(res, freshAccess, newRefreshToken);
      return res.status(200).json({
        success: true,
        message: "your tokens has been regenerated",
        code: "TOKEN_REFRESHED",
      });
    } catch {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }
  }
};

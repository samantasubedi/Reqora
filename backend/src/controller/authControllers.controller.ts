import { Request, Response } from "express";
import bcrypt from "bcrypt-ts";
import { prisma } from "../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { refresh } from "../services/authService.service";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !password) {
      return res.status(400).json({ message: "all fields are required" }); // 400 means bad request
    }
    const duplicateUser = await prisma.user.findUnique({
      where: { username },
    });
    if (duplicateUser) {
      return res.status(409).json({
        success: false,
        code: "DUPLICATE_USERNAME",
        message: "Username already taken",
      }); // 409 means its a conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUsers = await prisma.user.count();
    console.log(" total number of existing users are", existingUsers);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: null,
      },
    });
    res.status(201).json({
      success: true,
      code: "ACCOUNT_REGISTERED",
      message: `Your account has been registered`,
    }); // 201 means created
  } catch (err) {
    res.status(500).json({
      success: false,
      code: "SERVER_FAILURE",
      message: "couldn't register your account",
    }); //500 means internal server error
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      code: "INVALID_CREDIENTIALS",
      message: "Incorrect username or password",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      code: "INVALID_CREDIENTIALS",
      message: "Incorrect username or password",
    });
  } else if (isPasswordCorrect) {
    let tokenData: { username: string; email: string; role?: string } = {
      username,
      email: user.email,
    };
    if (user.enrolled && user.role) {
      tokenData = { username, email: user.email, role: user.role };
    }
    const accessSecret = process.env.ACCESS_SECRET!;
    const refreshSecret = process.env.REFRESH_SECRET!;
    const accessToken = jwt.sign(tokenData, accessSecret, { expiresIn: "15m" }); //we can also give numeric time in ms instead of string
    const refreshToken = jwt.sign(tokenData, refreshSecret, {
      expiresIn: "15d",
    });
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

    res.status(200).json({
      success: true,
      code: "LOGIN_SUCCESSFULL",
      message: `You have been logged in as ${username}`,
      role: user.role,
      username: user.username,
    });
  }
};

export const handleLogout = (req: Request, res: Response) => {
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
export const handleRefresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "refresh token not found",
      code: "TOKEN_NOT_FOUND",
    });
  }
  try {
    const{code,accessToken,NewRefreshToken}=  await refresh(refreshToken)
    if(code=== "USER_NOT_FOUND"){
     throw new Error("user not found")
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
    return handleRefresh(req, res);
  }
  const userData = jwt.verify(accessToken, accessSecret) as JwtPayload;
  res.json({
    code: "LOGGEDIN",
    role: userData.role,
    username: userData.username,
    message: "user is logged in ",
  });
};

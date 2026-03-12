import { Request, Response } from "express";
import bcrypt from "bcrypt-ts";
import { prisma } from "../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { Role } from "../generated/prisma/enums";
import strict from "node:assert/strict";
import { isExpressionWithTypeArguments } from "typescript";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "all fields are required" }); // 400 means bad request
    }
    const duplicateUser = await prisma.users.findUnique({
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
    const existingUsers = await prisma.users.count();
    console.log(" total number of existing users are", existingUsers);
    let role: Role;
    if (existingUsers === 0) {
      role = Role.admin;
    } else {
      role = Role.employee;
    }
    await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role,
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
  const user = await prisma.users.findUnique({
    where: { username },
    select: { password: true, role: true },
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
    if (!user.role) {
      return res.status(500).json({
        success: false,
        code: "SERVER_ERROR",
        message: "server error !",
      });
    }
    const role = user.role;
    const tokenData = { username, role };
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
    });
  }
};

export const handleLogout = (req: Request, res: Response) => {
  res.json({ message: "this is logout page" });
};
export const handleRefresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "refresh token not found",
      code: "TOKEN_NOT_FOUND",
    });
  }
  try {
    const refreshSecret = process.env.REFRESH_SECRET!;
    const accessSecret = process.env.ACCESS_SECRET!;
    const decodedToken = jwt.verify(refreshToken, refreshSecret);

    const { iat, exp, ...tokenData } = decodedToken as JwtPayload;

    const accessToken = jwt.sign(tokenData, accessSecret, {
      expiresIn: "15m",
    });
    const NewRefreshToken = jwt.sign(tokenData, refreshSecret, {
      expiresIn: "15d",
    });
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
    res.status(201).json({
      success: true,
      message: "your access token has been regenerated",
      code: "TOKEN_REGENERATED",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "invalid or expired refresh token",
      code: "INVALID_TOKEN",
    });
  }
};

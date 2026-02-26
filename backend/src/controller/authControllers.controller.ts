import { Request, Response } from "express";
import bcrypt from "bcrypt-ts";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import "dotenv/config";
import strict from "node:assert/strict";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ message: "all fields are required" }); // 400 means bad request
    }
    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "user already exists" }); // 409 means its a conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: "employee",
      },
    });
    res.status(201).send(`registered with username ${username}`); // 201 means created
  } catch (err) {
    res.status(500).send(`couldnt perform the action, ${err}`); //500 means internal server error
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const retrivedPassword = await prisma.users.findFirst({
    where: { username },
    select: { password: true },
  });
  if (!retrivedPassword) {
    return res.status(400).json({ message: "user not found" });
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    retrivedPassword.password,
  );
  if (isPasswordCorrect) {
    const role = prisma.users.findFirst({
      where: { username },
      select: { role: true },
    });
    const tokenData = { username, role };
    const accessSecret = process.env.ACCESS_SECRET!;
    const refreshSecret = process.env.REFRESH_SECRET!;
    const accessToken = jwt.sign(tokenData, accessSecret);
    const refreshToken = jwt.sign(tokenData, refreshSecret);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "you have been logged in ",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else if (!isPasswordCorrect) {
    res.status(200).json({ message: "incorrect password" });
  }
};

export const handleLogout = (req: Request, res: Response) => {
  res.json({ message: "this is logout page" });
};

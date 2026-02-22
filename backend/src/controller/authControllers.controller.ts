import { Request, Response } from "express";
import bcrypt from "bcrypt-ts";
import { prisma } from "../lib/prisma";
export const handleLogin = (req: Request, res: Response) => {
  res.json({ message: "post request sent to login page" });
};
export const handleRegister = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    if (!username || !password || !role) {
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
        role,
      },
    });
    res.status(201).send("data added to the database"); // 201 means created
  } catch (err) {
    res.status(500).send(`couldnt perform the action, ${err}`); //500 means internal server error
  }
};
export const handleLogout = (req: Request, res: Response) => {
  res.json({ message: "this is logout page" });
};

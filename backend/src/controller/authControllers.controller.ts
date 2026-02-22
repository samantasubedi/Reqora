import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const handleLogin = (req: Request, res: Response) => {
  res.json({ message: "post request sent to login page" });
};
export const handleRegister = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  console.log(username, password, role, "hellooooooooooooooo");
  await prisma.users.create({
    data: {
      username,
      password,
      role,
    },
  })
 res.status(200).send("data added to the database") 
  ;
};
export const handleLogout = (req: Request, res: Response) => {
  res.json({ message: "this is logout page" });
};

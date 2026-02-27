import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
export const getAllUsers = (req: Request, res: Response) => {
  res.send("this gets all users for admin dashboard");
};
export const getSpecificUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`this gets user data for specific user with id ${id}`);
};

// export const editUser=(req:Request, res:Response) => {
//   res.json({
//     message: "this edits the existing user info like name,personal details",
//   });
// }
export const changeUserRole = (req: Request, res: Response) => {
  res.json({ message: "used to change the userroles by admin" });
};
// export const deleteAllusers = async (req: Request, res: Response) => {
//   await prisma.users.deleteMany({});
// };

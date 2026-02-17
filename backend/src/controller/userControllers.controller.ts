import { Request,Response } from "express";
export const getAllUsers = (req:Request, res:Response) => {
  res.send("this gets all users for admin dashboard");
}
export const getSpecificUser =(req:Request, res:Response) => {
  const id = req.params.id;
  res.send(`this gets user data for specific user with id ${id}`);
}
export const createUser=(req:Request, res:Response) => {
  res.json({ message: "this creates new user" });
}
export const editUser=(req:Request, res:Response) => {
  res.json({
    message: "this edits the existing user info like name,personal details",
  });
}
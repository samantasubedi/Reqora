import { Request,Response } from "express";
export const handleLogin= (req:Request, res:Response) => {
  res.json({ message: "post request sent to login page" });
}
export const handleRegister =(req:Request, res:Response) => {
  res.json({ message: "post request to register page" });
}
export const handleLogout=(req:Request,res:Response)=>{res.json({"message":"this is logout page"})}
import { Request, Response } from "express";
import {prisma} from "../lib/prisma"
export const createCompany = async(req: Request, res: Response) => {
  const { name, email, address, size } = req.body;
if(!name||!email||!address||!size){
    res.json({
        message:"please provide all fields"
    })
}
else{
    // const response=await prisma.
}
  
};

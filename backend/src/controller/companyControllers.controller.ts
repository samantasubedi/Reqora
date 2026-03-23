import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const createCompany = async (req: Request, res: Response) => {
  const { companyName, email, address, size } = req.body;
  if (!companyName || !email || !address || !size) {
    res.json({
      message: "please provide all fields",
    });
  } else {
    const username = res.locals.user.username;
    const duplicateCompany=await prisma.company.findUnique({
        select:{
           companyName:true
        },
        where:{
            email
        }
    })
if(duplicateCompany){
    return res.json({message:`company already exists`})
}

    const response = await prisma.company.create({
      data: {
        companyName,
        email,
        address,
        size,
      },
    });

    const companyIdObj = await prisma.company.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    });
    if (companyIdObj) {
      const userResponse = await prisma.users.updateMany({
        data: {
          enrolled: true,
          companyId: companyIdObj.id,
        },
        where: {
          username,
        },
      });
     
    }

    res.json({
      message:
        "company data added , company id retrived and user table updated successfully",
    });
  }
};

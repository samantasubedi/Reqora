import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
export const getProfileInfo = async (req: Request, res: Response) => {
  const email = res.locals.user.email;

  if (!email) {
    throw new Error("authorization failed");
  }
  try {
    const userInfo = await prisma.user.findUnique({
      where: { email },
      select: {
        username: true,
        role: true,
        password: true,
        company: { select: { companyName: true, email: true, address: true } },
      },
    });
    if (!userInfo) {
      throw new Error("user not found");
    }
    const { username, role, password } = userInfo;
    const {
      companyName,
      address,
      email: companyEmail,
    } = userInfo.company || {};

    return res.status(201).json({
      username,
      role,
      password,
      companyName,
      address,
      companyEmail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "server error",
    });
  }
};
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
export const deleteAllusers = async (req: Request, res: Response) => {
  await prisma.request.deleteMany({});
  await prisma.joinToken.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  // await prisma.joinCode.deleteMany({});
  res.send("database has been reset");
};

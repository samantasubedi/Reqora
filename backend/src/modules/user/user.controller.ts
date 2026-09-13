import { prisma } from "../../lib/prisma";
import { NextFunction, Request, Response } from "express";
import { appError } from "../../utils/appError";
import {
  findUserDetailsByEmail,
  findUsersByCompanyId,
} from "./user.repository";
//Private routes, accessible by that specific user only
export const getProfileInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = res.locals.user.email;

    const userInfo = await findUserDetailsByEmail({ email });

    if (!userInfo) {
      throw new appError(404, "NOT_FOUND", "user not found");
    }
    const { username, role, description } = userInfo;
    const {
      companyName,
      address,
      email: companyEmail,
    } = userInfo.company || {};

    return res.status(201).json({
      username,
      role,
      email,
      companyName,
      address,
      companyEmail,
      description,
    });
  } catch (err) {
    next(err);
  }
};
export const editUser = (req: Request, res: Response) => {
  res.json({
    message: "this edits the existing user info like name,personal details",
  });
};
//general user routes, accessible by company
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const { skip, take } = res.locals.query;
    const users = await findUsersByCompanyId({ companyId, skip, take });
    const countsByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
      where: { companyId },
    });
    return res.status(200).json({
      success: true,
      code: "USERS_RETRIVED",
      data: users,
      countsByRole,
      message: "users retrived successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const getSpecificUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`this gets user data for specific user with id ${id}`);
};

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

import { prisma } from "../../lib/prisma";
import { NextFunction, Request, Response } from "express";
import { appError } from "../../utils/appError";
import {
  findUserById,
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
    const { skip, take, search, userRole, userDepartmentSearch } =
      res.locals.query;
    const users = await findUsersByCompanyId({
      companyId,
      skip,
      take,
      search,
      userRole,
      userDepartmentSearch,
    });
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
export const getSpecificUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id: string = String(req.params.id);
    if (!id) {
      throw new appError(400, "INVALID_ID", "invalid user id");
    }
    const userDetails = await findUserById({ id });
    return res.status(200).json({
      success: true,
      code: "USER_DETAILS_FETCHED",
      message: "user details fetched successfully",
      data: userDetails,
    });
  } catch (err) {
    next(err);
  }
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

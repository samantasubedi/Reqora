import { prisma } from "../../lib/prisma";
import { ResourceStatus, Role } from "../../generated/prisma/enums";
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

export const updateUserByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id: string = String(req.params.id);
    const { role, departmentId } = req.body as {
      role?: string;
      departmentId?: string;
    };
    if (!id) {
      throw new appError(400, "INVALID_ID", "invalid user id");
    }
    if (role === undefined && departmentId === undefined) {
      throw new appError(400, "NO_FIELDS", "nothing to update");
    }
    const adminCompanyId = res.locals.user.companyId;
    const targetUser = await prisma.user.findFirst({
      where: { id, companyId: adminCompanyId },
      select: { id: true, email: true, role: true },
    });
    if (!targetUser) {
      throw new appError(404, "NOT_FOUND", "user not found");
    }
    const data: { role?: Role; departmentId?: string } = {};
    if (role !== undefined) {
      if (!Object.values(Role).includes(role as Role)) {
        throw new appError(400, "INVALID_ROLE", "invalid role");
      }
      if (targetUser.email === res.locals.user.email) {
        throw new appError(
          403,
          "SELF_ROLE_CHANGE",
          "you cannot change your own role",
        );
      }
      const newRole = role as Role;
      if (targetUser.role === Role.admin && newRole !== Role.admin) {
        const adminCount = await prisma.user.count({
          where: { companyId: adminCompanyId, role: Role.admin },
        });
        if (adminCount <= 1) {
          throw new appError(
            400,
            "LAST_ADMIN",
            "at least one admin must remain in the company",
          );
        }
      }
      data.role = newRole;
    }
    if (departmentId !== undefined) {
      const department = await prisma.department.findFirst({
        where: { id: departmentId, companyId: adminCompanyId },
        select: { id: true },
      });
      if (!department) {
        throw new appError(404, "NOT_FOUND", "department not found");
      }
      data.departmentId = departmentId;
    }
    const promoteToAdmin =
      data.role === Role.admin && targetUser.role !== Role.admin;

    const selectResult = { id: true, role: true, department: true };

    let updatedUser;
    if (promoteToAdmin) {
      await prisma.$transaction([
        prisma.resourceItem.updateMany({
          where: { acquiredById: id },
          data: {
            acquiredById: null,
            status: ResourceStatus.available,
          },
        }),
        prisma.user.update({ where: { id }, data, select: selectResult }),
      ]);
      updatedUser = await prisma.user.findUnique({
        where: { id },
        select: selectResult,
      });
    } else {
      updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: selectResult,
      });
    }
    return res.status(200).json({
      success: true,
      code: "USER_UPDATED",
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id: string = String(req.params.id);
    if (!id) {
      throw new appError(400, "INVALID_ID", "invalid user id");
    }
    const adminCompanyId = res.locals.user.companyId;
    const targetUser = await prisma.user.findFirst({
      where: { id, companyId: adminCompanyId },
      select: { id: true, email: true, role: true },
    });
    if (!targetUser) {
      throw new appError(404, "NOT_FOUND", "user not found");
    }
    if (targetUser.email === res.locals.user.email) {
      throw new appError(400, "SELF_DELETE", "you cannot delete yourself");
    }
    if (targetUser.role === Role.admin) {
      const adminCount = await prisma.user.count({
        where: { companyId: adminCompanyId, role: Role.admin },
      });
      if (adminCount <= 1) {
        throw new appError(
          400,
          "LAST_ADMIN",
          "at least one admin must remain in the company",
        );
      }
    }
    await prisma.$transaction([
      prisma.request.deleteMany({
        where: { OR: [{ requestedById: id }, { reviewedById: id }] },
      }),
      prisma.resourceItem.deleteMany({ where: { acquiredById: id } }),
      prisma.user.delete({ where: { id } }),
    ]);
    return res.status(200).json({
      success: true,
      code: "USER_DELETED",
      message: "user deleted successfully",
    });
  } catch (err) {
    next(err);
  }
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

import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findUserDetailsByEmail = async ({ email }: { email: string }) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      username: true,
      role: true,
      description: true,

      company: { select: { companyName: true, email: true, address: true } },
    },
  });
};
export const findUsersByCompanyId = async ({
  companyId,
  skip,
  take,
  search,
  userRole,
  userDepartmentSearch,
}: {
  companyId: string;
  skip: number;
  take: number;
  search?: string;
  userRole?: Role;
  userDepartmentSearch?: string;
}) => {
  return prisma.user.findMany({
    where: {
      companyId,
      role: userRole ?? undefined,
      username: search ? { contains: search } : undefined,
      department: userDepartmentSearch
        ? {
            is: { name: { contains: userDepartmentSearch } },
          }
        : undefined,
    },
    select: {
      id: true,
      username: true,
      email: true,
      description: true,
      role: true,
      department: true,
      createdRequests: { include: { resource: true } },
      reviewedRequests: { include: { resource: true } },
    },

    skip,
    take,
  });
};
export const findUserById = async ({ id }: { id: string }) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      description: true,
      companyId: true,
      role: true,
      department: true,
      company: true,
      resourceItems: { include: { resource: true } },
      addedResources: { include: { department: true } },
      createdRequests: {
        include: {
          resource: true,
          reviewedBy: { select: { username: true } },
        },
      },
      reviewedRequests: {
        include: {
          resource: true,
          requestedBy: { select: { username: true } },
        },
      },
    },
  });
};

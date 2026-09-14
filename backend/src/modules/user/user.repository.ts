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
  search: string;
  userRole: Role;
  userDepartmentSearch: string;
}) => {
  return prisma.user.findMany({
    where: {
      companyId,
      role: userRole,
      username: { contains: search },
      department: { contains: userDepartmentSearch },
    },
    select: {
      id: true,
      username: true,
      email: true,
      description: true,
      role: true,
      department: true,
      createdRequests: true,
      reviewedRequests: true,
    },
    skip,
    take,
  });
};

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
}: {
  companyId: string;
  skip: number;
  take: number;
}) => {
  return prisma.user.findMany({
    where: {
      companyId,
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

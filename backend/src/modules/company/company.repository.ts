import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findCompanyByEmail = async (email: string) => {
  return await prisma.company.findUnique({
    where: { email },
  });
};

export const createCompanyRepo = async ({
  companyName,
  email,
  address,
  size,
}: {
  companyName: string;
  email: string;
  address: string;
  size: number;
}) => {
  return await prisma.company.create({
    data: {
      companyName,
      email,
      address,
      size,
    },
  });
};
export const updateUser = async ({
  role,
  enrolled,
  companyId,
  username,
}: {
  role: Role
  enrolled: boolean;
  companyId: string;
  username: string;
}) => {
  return await prisma.user.updateMany({
    data: {
      role,
      enrolled,
      companyId,
    },
    where: {
      username,
    },
  });
};

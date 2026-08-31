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
  role: Role;
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
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};
export const findCompanyByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
    select: { company: true },
  });
};
export const createJoinToken = async ({
  email,
  token,
  companyId,
  role,
  expiresAt,
}: {
  email: string;
  token: string;
  companyId: string;
  role: Role;
  expiresAt: string | Date;
}) => {
  return await prisma.joinToken.create({
    data: {
      email,
      token,
      companyId,
      role,
      expiresAt,
    },
  });
};

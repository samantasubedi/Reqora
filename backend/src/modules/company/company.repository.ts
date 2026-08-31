import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findCompanyByEmail = async ({email}:{email:string}) => {
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
export const findUserByEmail = async ({email}:{email: string}) => {
  return await prisma.user.findUnique({ where: { email } });
};
export const findCompanyByUsername = async ({username}:{username: string}) => {
  return await prisma.user.findUnique({
    where: { username },
    select: { company: true },
  });
};
export const storeJoinToken = async ({
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
export const findJoinToken = async ({token}:{token: string}) => {
  return await prisma.joinToken.findUnique({
    where: { token },
  });
};
export const updateUserAndJoinToken = async ({
  email,
  role,
  companyId,
  token,
}: {
  email: string;
  role: Role;
  companyId: string;
  token: string;
}) => {
  return await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: {
        enrolled: true,
        role,
        companyId,
      },
    }),
    prisma.joinToken.update({
      data: {
        used: true,
      },
      where: { token },
    }),
  ]);
};
export const storeJoinCode = async ({
  code,
  companyId,
  role,
  expiresAt,
}: {
  code: string;
  companyId: string;
  role: Role;
  expiresAt: Date | string;
}) => {
  return await prisma.joinCode.create({
    data: {
      code,
      companyId,
      role,
      expiresAt,
    },
  });
};
export const findJoinCode = async ({joinCode}:{joinCode: string}) => {
  return await prisma.joinCode.findUnique({
    where: { code: joinCode },
  });
};
export const updateUserAndJoinCode = async ({
  hashedJoinCode,
  email,
  role,
  companyId,
}: {
  hashedJoinCode: string;
  email: string;
  role: Role;
  companyId: string;
}) => {
  return await prisma.$transaction([
    prisma.joinCode.update({
      where: { code: hashedJoinCode },
      data: { used: true },
    }),
    prisma.user.update({
      where: { email },
      data: {
        role,
        enrolled: true,
        companyId,
      },
    }),
  ]);
};
export const leaveCompanyRepo=async({email}:{email:string})=>{
  return  await prisma.user.update({
      data: {
        role: null,
        companyId: null,
        enrolled: false,
      },
      where: { email },
    });

}
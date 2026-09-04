import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findByUsername = async ({username}:{username: string}) => {
  return await prisma.user.findUnique({ where: { username } });
};
export const createUser = async ({
  username,
  email,
  password,
  role,
}: {
  username: string;
  email: string;
  password: string;
  role: Role | null;
}) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
      role,
    },
  });
};

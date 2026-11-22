import { CompanyIndustry, ResourceStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const findCompanyByEmail = async ({email}:{email:string}) => {
  return await prisma.company.findUnique({
    where: { email },
  });
};
export const createCompanyWithAdminRepo = async ({
  companyName,
  email,
  address,
  size,
  industry,
  website,
  phoneNumber,
  username,
}: {
  companyName: string;
  email: string;
  address: string;
  size: number;
  industry: string;
  website?: string;
  phoneNumber?: string;
  username: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const createdCompany = await tx.company.create({
      data: {
        companyName,
        email,
        address,
        size,
        industry: industry as CompanyIndustry,
        website: website || null,
        phoneNumber: phoneNumber || null,
      },
    });

    const defaultDepartment = await tx.department.create({
      data: {
        name: "General",
        companyId: createdCompany.id,
      },
    });

    const updatedUser = await tx.user.update({
      where: {
        username,
      },
      data: {
        role: Role.admin,
        companyId: createdCompany.id,
        departmentId: defaultDepartment.id,
        joinedAt: new Date(),
      },
    });

    return {
      createdCompany,
      updatedUser,
    };
  });
};
export const findDepartmentById = async ({ id }: { id: string }) => {
  return prisma.department.findUnique({ where: { id } });
};
export const countAdminsInCompany = async ({
  companyId,
  excludeEmail,
}: {
  companyId: string;
  excludeEmail: string;
}) => {
  return prisma.user.count({
    where: {
      companyId,
      role: Role.admin,
      email: { not: excludeEmail },
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
  departmentId,
  role,
  expiresAt,
}: {
  email: string;
  token: string;
  companyId: string;
  departmentId: string;
  role: Role;
  expiresAt: string | Date;
}) => {
  return await prisma.joinToken.create({
    data: {
      email,
      token,
      companyId,
      departmentId,
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
  departmentId,
  token,
}: {
  email: string;
  role: Role;
  companyId: string;
  departmentId: string;
  token: string;
}) => {
  return await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: {
        role,
        companyId,
        departmentId,
        joinedAt: new Date(),
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
  departmentId,
  role,
  expiresAt,
}: {
  code: string;
  companyId: string;
  departmentId: string;
  role: Role;
  expiresAt: Date | string;
}) => {
  return await prisma.joinCode.create({
    data: {
      code,
      companyId,
      departmentId,
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
  departmentId,
}: {
  hashedJoinCode: string;
  email: string;
  role: Role;
  companyId: string;
  departmentId: string;
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
        companyId,
        departmentId,
        joinedAt: new Date(),
      },
    }),
  ]);
};
export const findDepartmentsByCompanyId = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return prisma.department.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      _count: {
        select: { users: true, resources: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};
export const createDepartment = async ({
  name,
  companyId,
}: {
  name: string;
  companyId: string;
}) => {
  return prisma.department.create({
    data: {
      name,
      companyId,
    },
  });
};
export const findDepartmentByName = async ({
  name,
  companyId,
}: {
  name: string;
  companyId: string;
}) => {
  return prisma.department.findFirst({
    where: {
      companyId,
      name,
    },
  });
};
export const leaveCompanyRepo = async ({ email }: { email: string }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  return prisma.$transaction([
    prisma.resourceItem.updateMany({
      where: { acquiredById: user.id },
      data: {
        acquiredById: null,
        status: ResourceStatus.available,
      },
    }),
    prisma.user.update({
      data: {
        role: null,
        companyId: null,
        departmentId: null,
        leftAt: new Date(),
      },
      where: { email },
    }),
  ]);
};

export const findCompanyById = async ({ id }: { id: string }) => {
  return prisma.company.findUnique({ where: { id } });
};

export const updateCompanyById = async ({
  id,
  data,
}: {
  id: string;
  data: {
    companyName?: string;
    email?: string;
    address?: string;
    size?: number;
    industry?: CompanyIndustry;
    website?: string | null;
    phoneNumber?: string | null;
  };
}) => {
  return prisma.company.update({ where: { id }, data });
};

export const findDepartmentWithCounts = async ({ id }: { id: string }) => {
  return prisma.department.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      companyId: true,
      _count: {
        select: {
          users: true,
          resources: true,
          joinTokens: true,
          joinCodes: true,
        },
      },
    },
  });
};

export const countDepartmentsByCompanyId = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return prisma.department.count({ where: { companyId } });
};

export const findDepartmentByNameExcludingId = async ({
  name,
  companyId,
  excludeId,
}: {
  name: string;
  companyId: string;
  excludeId: string;
}) => {
  return prisma.department.findFirst({
    where: {
      companyId,
      name,
      id: { not: excludeId },
    },
  });
};

export const updateDepartmentById = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  return prisma.department.update({ where: { id }, data: { name } });
};

export const deleteDepartmentById = async ({ id }: { id: string }) => {
  return prisma.$transaction([
    prisma.joinToken.deleteMany({ where: { departmentId: id } }),
    prisma.joinCode.deleteMany({ where: { departmentId: id } }),
    prisma.department.delete({ where: { id } }),
  ]);
};
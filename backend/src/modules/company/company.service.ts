import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import {
  createCompanyWithAdminRepo,
  storeJoinToken,
  findCompanyByEmail,
  findCompanyByUsername,
  findUserByEmail,
  storeJoinCode,
  findJoinToken,
  updateUserAndJoinToken,
  findJoinCode,
  updateUserAndJoinCode,
  leaveCompanyRepo,
  findDepartmentById,
  countAdminsInCompany,
  findDepartmentsByCompanyId,
  createDepartment,
  findDepartmentByName,
} from "./company.repository";
import crypto from "crypto";
import {
  createCompanyType,
  emailInviteType,
  generateCodeType,
} from "./company.schema";
import { sendMail } from "../../utils/sendMail";
import cryptoRandomString from "crypto-random-string";
import { prisma } from "../../lib/prisma";
export const createCompanyService = async ({
  companyName,
  email,
  address,
  size,
  username,
}: createCompanyType & { username: string }) => {
  const duplicateEmail = await findCompanyByEmail({ email });
  if (duplicateEmail) {
    throw new appError(
      400,
      "DUPLICATE_EMAIL",
      "company already registered with this email",
    );
  }

  const userData = await findByUsername({ username });
    if (!userData) {
    throw new appError(
      404,
      "USER_NOT_FOUND",
      "User not found",
    );}
  if (userData.companyId) {
    throw new appError(
      400,
      "USER_ENROLLED",
      "user is already enrolled in a company,leave the current company to join new one",
    );
  }
  return createCompanyWithAdminRepo({
    companyName,
    email,
    address,
    size,
    username,
  });
};
export const emailInviteService = async ({
  email,
  role,
  message,
  expiryTime,
  departmentId,
  adminUsername,
}: emailInviteType & { adminUsername: string }) => {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const inviteUrl = `${frontendUrl}/getstarted/join/accept-invite?token=${token}`;
  const companyEmail = process.env.COMPANY_EMAIL!;
  const invitedUser = await findUserByEmail({ email });

  if (invitedUser?.companyId) {
    throw new appError(
      409,
      "ENROLLED",
      "Couldn't send invitation,This user is already enrolled in a company",
    );
  }

  const companyInfo = await findCompanyByUsername({ username: adminUsername });

  if (!companyInfo?.company) {
    return console.log("authentication failed!");
  }

  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== companyInfo.company.id) {
    throw new appError(
      400,
      "INVALID_DEPARTMENT",
      "department does not belong to this company",
    );
  }

  const createdToken = await storeJoinToken({
    email,
    token: hashedToken,
    companyId: companyInfo?.company?.id,
    departmentId,
    role,
    expiresAt: new Date(Date.now() + expiryTime),
  });

  await sendMail({
    senderEmail: companyEmail,
    receiverEmail: email,
    companyName: companyInfo.company.companyName,
    message,
    inviteUrl,
  });
};
export const generateCodeService = async ({
  role,
  expiryTime,
  departmentId,
  email,
}: generateCodeType & { email: string }) => {
  const joinCode = cryptoRandomString({ length: 10, type: "alphanumeric" });
  const hashedJoinCode = crypto
    .createHash("sha256")
    .update(joinCode)
    .digest("hex");

  const userInfo = await findUserByEmail({ email });
  if (!userInfo?.companyId) {
    throw new appError(500, "SERVER_ERROR", "unable to retrive user info");
  }

  const department = await findDepartmentById({ id: departmentId });
  if (!department || department.companyId !== userInfo.companyId) {
    throw new appError(
      400,
      "INVALID_DEPARTMENT",
      "department does not belong to your company",
    );
  }
  const expiresAt = new Date(Date.now() + expiryTime);
  const storedCode = await storeJoinCode({
    code: hashedJoinCode,
    companyId: userInfo.companyId,
    departmentId,
    role,
    expiresAt,
  });
  return joinCode;
};
export const joinByEmailService = async ({
  email,
  joinToken,
}: {
  email: string;
  joinToken: string;
}) => {
  const userInfo = await findUserByEmail({ email });

  if (!userInfo) {
    throw new appError(404, "USER_NOT_FOUND", "user not found");
  }

  if (userInfo.companyId) {
    throw new appError(
      409,
      "ENROLLED",
      "Couldnt accept invitation, you are already enrolled in a company",
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(joinToken)
    .digest("hex");
  const retrivedToken = await findJoinToken({ token: hashedToken });
  if (!retrivedToken) {
    throw new appError(400, "JOIN_FAILED", "Invalid token");
  }

  if (retrivedToken.email !== email) {
    throw new appError(400, "JOIN_FAILED", "Invalid token");
  }
  if (retrivedToken.used || retrivedToken.expiresAt < new Date()) {
    throw new appError(400, "TOKEN_EXPIRED", "your token is expired");
  }

  const result = await updateUserAndJoinToken({
    email,
    role: retrivedToken.role,
    companyId: retrivedToken.companyId,
    departmentId: retrivedToken.departmentId,
    token: hashedToken,
  });

  return result;
};
export const joinByCodeService = async ({
  joinCode,
  email,
}: {
  joinCode: string;
  email: string;
}) => {
  const hashedJoinCode = crypto
    .createHash("sha256")
    .update(joinCode)
    .digest("hex");
  const retrivedCode = await findJoinCode({ joinCode: hashedJoinCode });
  if (!retrivedCode) {
    throw new appError(400, "INVALID_CODE", "invalid join code");
  }
  if (retrivedCode.used) {
    throw new appError(400, "INVALID_CODE", "code has been already used");
  }
  if (retrivedCode.expiresAt < new Date()) {
    throw new appError(400, "CODE_EXPIRED", "Code has been expried");
  }
  const userInfo = await findUserByEmail({ email });
  if (!userInfo) {
    throw new appError(404, "USER_NOT_FOUND", "user not found");
  }
  if (userInfo.companyId) {
    throw new appError(
      409,
      "ENROLLED",
      "Couldnt accept invitation, you are already enrolled in a company",
    );
  }
  const result = await updateUserAndJoinCode({
    hashedJoinCode,
    email,
    role: retrivedCode.role,
    companyId: retrivedCode.companyId,
    departmentId: retrivedCode.departmentId,
  });
  return result;
};
export const getDepartmentsService = async ({
  companyId,
}: {
  companyId: string;
}) => {
  if (!companyId) {
    throw new appError(
      400,
      "USER_NOT_ENROLLED",
      "User does not belong to a company",
    );
  }
  return findDepartmentsByCompanyId({ companyId });
};
export const addDepartmentService = async ({
  name,
  companyId,
}: {
  name: string;
  companyId: string;
}) => {
  if (!companyId) {
    throw new appError(
      400,
      "USER_NOT_ENROLLED",
      "User does not belong to a company",
    );
  }
  const duplicate = await findDepartmentByName({ name, companyId });
  if (duplicate) {
    throw new appError(
      400,
      "DUPLICATE_DEPARTMENT",
      "department already exists in this company",
    );
  }
  return createDepartment({ name, companyId });
};
export const leaveCompanyService = async ({
  email,
  role,
  companyId,
}: {
  email: string;
  role: string;
  companyId: string;
}) => {
  if (!companyId || !role) {
    throw new appError(400, "EXIT_FAILED", "user is not enrolled in company");
  }
  if (role == "admin") {
    const adminCount = await countAdminsInCompany({
      companyId,
      excludeEmail: email,
    });
    if (adminCount === 0) {
      throw new appError(
        400,
        "EXIT_FAILED",
        "admin cannot leave their own company",
      );
    }
  }
  const result = await leaveCompanyRepo({ email });
  return result;
};
export const dashabordAnalyticsService = async ({
  companyId,
}: {
  companyId: string;
}) => {
  const resourceCountsByStatus = await prisma.resourceItem.groupBy({
    by: ["status"],
    _count: true,
    where: { resource: { companyId } },
  });
  const resourceCountsByType = await prisma.resource.groupBy({
    by: ["type"],
    _count: true,
    where: { companyId },
  });
  const totalResourceCount = await prisma.resourceItem.count({
    where: { resource: { companyId } },
  });
  const userCountsByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
    where: { companyId },
  });
  const userCountsByDepartments = await prisma.department.findMany({
    where: {
      companyId,
    },
    select: {
      name: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
  return {
    resourceStats: {
      countsByStatus: [
        ...resourceCountsByStatus,
        { status: "all", _count: totalResourceCount },
      ],
      countsByType: resourceCountsByType,
    },
    userStats: {
      countsByRole: userCountsByRole,
      countsByDepartment: userCountsByDepartments,
    },
  };
};

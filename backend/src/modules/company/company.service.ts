import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import {
  createCompanyRepo,
  storeJoinToken,
  findCompanyByEmail,
  findCompanyByUsername,
  findUserByEmail,
  updateUser,
  storeJoinCode,
  findJoinToken,
  updateUserAndJoinToken,
  findJoinCode,
  updateUserAndJoinCode,
  leaveCompanyRepo,
} from "./company.repository";
import crypto from "crypto";
import {
  createCompanyType,
  emailInviteType,
  generateCodeType,
} from "./company.schema";
import { sendMail } from "../../utils/sendMail";
import cryptoRandomString from "crypto-random-string";
export const createCompanyService = async ({
  companyName,
  email,
  address,
  size,
  username,
}: createCompanyType & { username: string }) => {
  const duplicateEmail = await findCompanyByEmail({email});
  if (duplicateEmail) {
    throw new appError(
      400,
      "DUPLICATE_EMAIL",
      "company already registered with this email",
    );
  }

  const userData = await findByUsername({username});
  if (userData?.enrolled) {
    throw new appError(
      400,
      "USER_ENROLLED",
      "user is already enrolled in a company,leave the current company to join new one",
    );
  }
  const createdCompany = await createCompanyRepo({
    companyName,
    email,
    address,
    size,
  });

  const updatedUser = await updateUser({
    role: "admin",
    enrolled: true,
    companyId: createdCompany.id,
    username,
  });

  return { createdCompany, updatedUser };
};
export const emailInviteService = async ({
  email,
  role,
  message,
  expiryTime,
  adminUsername,
}: emailInviteType & { adminUsername: string }) => {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const inviteUrl = `${frontendUrl}/getstarted/join/accept-invite?token=${token}`;
  const companyEmail = process.env.COMPANY_EMAIL!;
  const invitedUser = await findUserByEmail({email});

  if (invitedUser?.enrolled === true) {
    throw new appError(
      409,
      "ENROLLED",
      "Couldn't send invitation,This user is already enrolled in a company",
    );
  }

  const companyInfo = await findCompanyByUsername({username:adminUsername});

  if (!companyInfo?.company) {
    return console.log("authentication failed!");
  }

  const createdToken = await storeJoinToken({
    email,
    token: hashedToken,
    companyId: companyInfo?.company?.id,
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
  email,
}: generateCodeType & { email: string }) => {
  const joinCode = cryptoRandomString({ length: 10, type: "alphanumeric" });
  const hashedJoinCode = crypto
    .createHash("sha256")
    .update(joinCode)
    .digest("hex");

  const userInfo = await findUserByEmail({email});
  if (!userInfo?.companyId) {
    throw new appError(500, "SERVER_ERROR", "unable to retrive user info");
  }
  const expiresAt = new Date(Date.now() + expiryTime);
  const storedCode = await storeJoinCode({
    code: hashedJoinCode,
    companyId: userInfo.companyId,
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
  const userInfo = await findUserByEmail({email});
  if (userInfo?.enrolled) {
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
  const retrivedToken = await findJoinToken({token:hashedToken});
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
  const retrivedCode = await findJoinCode({joinCode:hashedJoinCode});
  if (!retrivedCode) {
    throw new appError(400, "INVALID_CODE", "invalid join code");
  }
  if (retrivedCode.used) {
    throw new appError(400, "INVALID_CODE", "code has been already used");
  }
  if (retrivedCode.expiresAt < new Date()) {
    throw new appError(400, "CODE_EXPIRED", "Code has been expried");
  }
  const userInfo = await findUserByEmail({email});
  if (userInfo?.enrolled) {
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
  });
  return result;
};
export const leaveCompanyService = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  if (role == "admin") {
    throw new appError(
      400,
      "EXIT_FAILED",
      "admin cannot leave thier own company",
    );
  }
  if (!role) {
    throw new appError(400, "EXIT_FAILED", "user is not enrolled in company");
  }
  const result = await leaveCompanyRepo({ email });
  return result;
};

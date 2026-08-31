import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import {
  createCompanyRepo,
  createJoinToken,
  findCompanyByEmail,
  findCompanyByUsername,
  findUserByEmail,
  updateUser,
} from "./company.repository";
import crypto from "crypto";
import { emailInviteType } from "./company.schema";
import { sendMail } from "../../utils/sendMail";

export const createCompanyService = async ({
  companyName,
  email,
  address,
  size,
  username,
}: {
  companyName: string;
  email: string;
  address: string;
  size: number;
  username: string;
}) => {
  const duplicateEmail = await findCompanyByEmail(email);
  if (duplicateEmail) {
    throw new appError(
      400,
      "DUPLICATE_EMAIL",
      "company already registered with this email",
    );
  }

  const userData = await findByUsername(username);
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
  const invitedUser = await findUserByEmail(email);

  if (invitedUser?.enrolled === true) {
    throw new appError(
      409,
      "ENROLLED",
      "Couldn't send invitation,This user is already enrolled in a company",
    );
  }

  const companyInfo = await findCompanyByUsername(adminUsername);

  if (!companyInfo?.company) {
    return console.log("authentication failed!");
  }

    const createdToken = await createJoinToken({
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

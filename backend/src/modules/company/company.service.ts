import { appError } from "../../utils/appError";
import { findByUsername } from "../auth/auth.repository";
import {
  createCompanyRepo,
  findCompanyByEmail,
  updateUser,
} from "./company.repository";

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

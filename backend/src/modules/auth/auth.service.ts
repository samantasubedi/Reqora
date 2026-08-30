import { createUser, findByUsername } from "./auth.repository";
import bcrypt from "bcrypt-ts";
export const registerUser = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  const duplicateUser = await findByUsername(username);
  if (duplicateUser) {
    return res.status(409).json({
      success: false,
      code: "DUPLICATE_USERNAME",
      message: "Username already taken",
    }); // 409 means its a conflict
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser({ username, email, password: hashedPassword, role: null });
};

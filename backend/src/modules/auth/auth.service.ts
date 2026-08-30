import { appError } from "../../utils/appError";
import { createUser, findByUsername } from "./auth.repository";
import jwt from "jsonwebtoken"
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
    throw new appError(409, "DUPLICATE_USER", "user already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await createUser({
    username,
    email,
    password: hashedPassword,
    role: null,
  });
  return createdUser;
};
export const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await findByUsername(username);
  if (!user) {
    throw new appError(
      401,
      "INVALID_CREDIENTIALS",
      "Incorrect username or password",
    );
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new appError(
      401,
      "INVALID_CREDIENTIALS",
      "Incorrect username or password",
    );
  } else if (isPasswordCorrect) {
    let tokenData: {
      username: string;
      email: string;
      role?: string;
      companyId?: string;
    } = {
      username,
      email: user.email,
    };
    if (user.enrolled && user.role) {
      tokenData = { username, email: user.email, role: user.role };
    }
    const accessSecret = process.env.ACCESS_SECRET!;
    const refreshSecret = process.env.REFRESH_SECRET!;
    const accessToken = jwt.sign(tokenData, accessSecret, { expiresIn: "15m" }); //we can also give numeric time in ms instead of string
    const refreshToken = jwt.sign(tokenData, refreshSecret, {
      expiresIn: "15d",
    });
    return ({user,refreshToken,accessToken})

 

  
  }
};

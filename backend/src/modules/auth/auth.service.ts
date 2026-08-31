import { appError } from "../../utils/appError";
import { createUser, findByUsername } from "./auth.repository";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt-ts";
import { loginType, registerType } from "./auth.schema";

export const registerUser = async ({
  email,
  username,
  password,
}: registerType) => {
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
export const loginUser = async ({ username, password }: loginType) => {
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
      companyId?: string | null;
    } = {
      username,
      email: user.email,
    };
    if (user.enrolled && user.role) {
      tokenData = {
        username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      };
    }
    const accessSecret = process.env.ACCESS_SECRET!;
    const refreshSecret = process.env.REFRESH_SECRET!;
    const accessToken = jwt.sign(tokenData, accessSecret, { expiresIn: "15m" }); //we can also give numeric time in ms instead of string
    const refreshToken = jwt.sign(tokenData, refreshSecret, {
      expiresIn: "15d",
    });
    return { user, refreshToken, accessToken };
  }
};

export const refresh = async (
  refreshToken: string,
): Promise<{
  accessToken: string;
  newRefreshToken: string;
}> => {
  const refreshSecret = process.env.REFRESH_SECRET!;
  const accessSecret = process.env.ACCESS_SECRET!;
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, refreshSecret);
  } catch {
    throw new appError(401, "INVALID_TOKEN", "Invalid or expired token");
  }

  const { iat, exp, ...tokenData } = decodedToken as JwtPayload;
  const userData = await findByUsername(tokenData.username);
  if (!userData) {
    //user may have been removed from the company but token could still exist in users cookie
    throw new appError(400, "USER_NOT_FOUND", "invalid token, user not found");
  }

  let data;
  if (userData?.enrolled) {
    data = {
      username: userData.username,
      email: userData.email,
      role: userData.role,
      companyId: userData.companyId,
    };
  } else if (!userData?.enrolled) {
    data = {
      username: userData.username,
      email: userData.email,
    };
  }
  if (!data) {
    throw new appError(400, "USER_NOT_FOUND", "invalid token, user not found");
  }

  const accessToken = jwt.sign(data, accessSecret, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign(data, refreshSecret, {
    expiresIn: "15d",
  });

  return { accessToken, newRefreshToken };
};

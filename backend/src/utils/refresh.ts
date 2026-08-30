import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
export type returnType = {
  code: string;
  accessToken?: string;
  NewRefreshToken?: string;
};
export const refresh = async (refreshToken: string): Promise<returnType> => {
  const refreshSecret = process.env.REFRESH_SECRET!;
  const accessSecret = process.env.ACCESS_SECRET!;
  const decodedToken = jwt.verify(refreshToken, refreshSecret);
  const { iat, exp, ...tokenData } = decodedToken as JwtPayload;

  let code: string;
  const userData = await prisma.user.findUnique({
    where: { username: tokenData.username },
  });
  if (!userData) {
    //user may have been removed from the company but token could still exist in users cookie
    code = "USER_NOT_FOUND";
    return { code };
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
    return { code: "USER_NOT_FOUND" };
  }

  const accessToken = jwt.sign(data, accessSecret, {
    expiresIn: "15m",
  });
  const NewRefreshToken = jwt.sign(data, refreshSecret, {
    expiresIn: "15d",
  });
  code = "TOKEN_REGENERATED";
  return { accessToken, NewRefreshToken, code };
};

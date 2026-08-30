import { Response } from "express";
export const setCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    sameSite: "strict",
    httpOnly: true,
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

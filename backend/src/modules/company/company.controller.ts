import crypto from "crypto";
import { transporter } from "../../lib/sendMail";
import cryptoRandomString from "crypto-random-string";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { refresh } from "../auth/auth.service";
import {
  createCompanyService,
  emailInviteService,
  generateCodeService,
  joinByCodeService,
  joinByEmailService,
} from "./company.service";
import { setCookie } from "../../utils/setCookie";
import { findUserByEmail } from "./company.repository";

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { companyName, email, address, size } = req.body;
  try {
    const username = res.locals.user.username;
    const { createdCompany } = await createCompanyService({
      companyName,
      email,
      address,
      size,
      username,
    });
    const refreshToken = req.cookies.refreshToken;
    const { accessToken, newRefreshToken } = await refresh(refreshToken);

    if (accessToken && newRefreshToken)
      setCookie(res, accessToken, newRefreshToken);

    return res.status(201).json({
      success: true,
      code: "COMPANY_CREATED",
      message: "company created successfully",
      data: createdCompany,
    });
  } catch (err) {
    next(err);
  }
};

export const inviteToCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email: userEmail, role, message, expiryTime } = req.body;
  try {
    const username = res.locals.user.username;
    await emailInviteService({
      email: userEmail,
      role,
      message,
      expiryTime,
      adminUsername: username,
    });
    return res.status(200).json({
      success: true,
      code: "EMAIL_SENT",
      message: "Join inviation sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const generateCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role, expiryTime } = req.body;
    const email = res.locals.user.email;
    const joinCode = await generateCodeService({
      role,
      expiryTime,
      email,
    });
    res.status(201).json({
      success: true,
      code: "CODE_GENERATED",
      joinCode,
      message: "code generated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const joinByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { joinToken } = req.body;
    const email = res.locals.user.email;
    const refreshToken = req.cookies.refreshToken;
    const result = await joinByEmailService({ joinToken, email });
    console.log("this is result returned by transaction", result);
    if (refreshToken) {
      try {
        const { accessToken, newRefreshToken } = await refresh(refreshToken);

        setCookie(res, accessToken, newRefreshToken);
      } catch (err) {
        res.clearCookie("refreshToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: true,
        });
      }
    }
    return res.status(201).json({
      success: true,
      message: "You have been joined to the company",
      code: "JOIN_SUCCESSFULL",
      role: result[0].role,
    });
  } catch (err) {
    next(err);
  }
};

export const joinByCode = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { joinCode } = req.body;
    const email = res.locals.user.email;
    const result = await joinByCodeService({ joinCode, email });
    console.log("this is the result of join by code service", result);
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const { accessToken, newRefreshToken } = await refresh(refreshToken);
        setCookie(res, accessToken, newRefreshToken);
      } catch (err) {
        res.clearCookie("refreshToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: true,
        });
      }
    }

    return res.status(201).json({
      role: result[1].role, 
      success: "true",
      code: "JOIN_SUCCESSFULL",
      message: "You have been joined to the company",
    });
  } catch (err) {
   next(err)
  }
};
export const leaveCompany = async (req: Request, res: Response) => {
  const userdata = res.locals.user;
  const email = userdata.email;
  try {
    await prisma.user.updateMany({
      data: {
        role: null,
        companyId: null,
        enrolled: false,
      },
      where: { email },
    });

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const { accessToken, newRefreshToken } = await refresh(refreshToken);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", newRefreshToken, {
          sameSite: "strict",
          httpOnly: true,
          secure: true,
          maxAge: 15 * 24 * 60 * 60 * 1000,
        });
      } catch (err) {
        res.clearCookie("refreshToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: true,
        });
      }
    }
    res.json({
      success: true,
      message: "company left successfully",
      code: "COMPANY_LEFT",
    });
  } catch (err) {
    res.json({
      success: false,
      message: "unable to leave the company",
      code: "EXIT_FAILED",
    });
  }
};

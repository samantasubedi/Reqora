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
} from "./company.service";
import { setCookie } from "../../utils/setCookie";

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
    const generatedCodeObject = await generateCodeService({
      role,
      expiryTime,
      email,
    });
    res.status(201).json({
      success: true,
      code: "CODE_GENERATED",
      joinCode: generatedCodeObject.code,
      message: "code generated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const joinByEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  console.log("this is the token", code);
  if (!code) {
    console.log("token is required");
    return res.status(400).json({
      success: false,
      code: "TOKEN_NOT_FOUND",
      message: "token is required",
    });
  }
  const email = res.locals.user.email;
  const userEnrolled = await prisma.user.findUnique({
    where: { email },
    select: { enrolled: true },
  });
  if (userEnrolled?.enrolled) {
    return res.status(400).json({
      success: false,
      code: "ENROLLED",
      message:
        "Couldnt accept invitation, you are already enrolled in a company",
    });
  }

  try {
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    const retrivedToken = await prisma.joinToken.findUnique({
      where: { token: hashedCode },
    });

    if (!retrivedToken) {
      return res.status(404).json({
        success: false,
        code: "JOIN_FAILED",
        message: "Invalid token!",
      });
    }

    if (retrivedToken.email === email) {
      if (retrivedToken.used || retrivedToken.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Your token has been expired",
          code: "TOKEN_EXPIRED",
        });
      }
      await prisma.$transaction([
        prisma.user.update({
          where: { email },
          data: {
            enrolled: true,
            role: retrivedToken.role,
            companyId: retrivedToken.companyId,
          },
        }),
        prisma.joinToken.update({
          data: {
            used: true,
          },
          where: { token: hashedCode },
        }),
      ]);
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        try {
          const { accessToken, newRefreshToken } = await refresh(refreshToken);
          if (code === "USER_NOT_FOUND") {
            throw new Error("user not found");
          }
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
      return res.status(201).json({
        success: true,
        message: "You have been joined to the company",
        code: "JOIN_SUCCESSFULL",
        role: retrivedToken.role,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Couldn't join to the company, token may have been expired",
        code: "JOIN_FAILED",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      code: "JOIN_FAILED",
      message: "Couldn't join to the company, token may have been expired",
    });
  }
};
export const joinByCode = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "please provide all fields" });
  }
  const email = res.locals.user.email;

  const hashedJoinCode = crypto.createHash("sha256").update(code).digest("hex");
  try {
    const retrivedCode = await prisma.joinCode.findUnique({
      where: { code: hashedJoinCode },
    });

    if (!retrivedCode) {
      return res.status(500).json({ success: false, message: "Invalid code" });
    }
    if (retrivedCode.used) {
      return res.status(400).json({
        success: false,
        message: "Code has already been used",
      });
    }
    const userEnrolled = await prisma.user.findUnique({
      where: { email },
      select: { enrolled: true },
    });
    if (userEnrolled?.enrolled) {
      return res.status(400).json({
        success: false,
        code: "ENROLLED",
        message:
          "Couldnt accept invitation, you are already enrolled in a company",
      });
    }
    if (retrivedCode.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Code has been expried" });
    }

    await prisma.joinCode.update({
      where: { code: hashedJoinCode },
      data: { used: true },
    });
    await prisma.user.update({
      where: { email },
      data: {
        role: retrivedCode.role,
        enrolled: true,
        companyId: retrivedCode.companyId,
      },
    });
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const { accessToken, newRefreshToken } = await refresh(refreshToken);
        if (code === "USER_NOT_FOUND") {
          throw new Error("user not found");
        }
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

    return res.status(201).json({
      role: retrivedCode.role,
      success: "true",
      code: "JOIN_SUCCESSFULL",
      message: "You have been joined to the company",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
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

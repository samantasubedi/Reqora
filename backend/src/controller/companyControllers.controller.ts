import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt-ts";

export const createCompany = async (req: Request, res: Response) => {
  const { companyName, email, address, size } = req.body;
  if (!companyName || !email || !address || !size) {
    return res.status(400).json({
      success: false,
      code: "INSUFFICIENT_DATA",
      message: "please provide all fields",
    });
  }

  try {
    const username = res.locals.user.username;
    const duplicateEmail = await prisma.company.findUnique({
      select: {
        companyName: true,
      },
      where: {
        email,
      },
    });
    if (duplicateEmail) {
      return res.status(400).json({
        success: false,
        code: "DUPLICATE_EMAIL",
        message: `company already registered with this email`,
      });
    }

    const userData = await prisma.user.findFirst({
      select: { enrolled: true },
      where: { username },
    });
    if (userData?.enrolled) {
      return res.status(400).json({
        success: false,
        code: "USER_ENROLLED",
        message:
          "You are already enrolled in a company, leave the current company to join new one",
      });
    }
    await prisma.company.create({
      data: {
        companyName,
        email,
        address,
        size,
      },
    });

    const companyIdObj = await prisma.company.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    });
    if (companyIdObj) {
      await prisma.user.updateMany({
        data: {
          role: "admin",
          enrolled: true,
          companyId: companyIdObj.id,
        },
        where: {
          username,
        },
      });
    }

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const { code, accessToken, NewRefreshToken } =
          await refresh(refreshToken);
        if (code === "USER_NOT_FOUND") {
          throw new Error("user not found");
        }
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", NewRefreshToken, {
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
    res.status(200).json({
      success: true,
      code: "COMPANY_CREATED",
      message: "company created successfully",
    });
  } catch (err) {
    res.json({
      success: false,
      code: "CREATION_FAILED",
      message: "failed to create company",
    });
  }
};

import crypto from "crypto";
import { transporter } from "../lib/sendMail";
import { refresh } from "../services/authService.service";
import cryptoRandomString from "crypto-random-string";
import { userInfo } from "os";

export const inviteToCompany = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const { role, expiryTime } = req.body;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const inviteUrl = `${frontendUrl}/join?token=${token}`;
  const companyEmail = process.env.COMPANY_EMAIL;
  if (!userEmail) {
    res.status(400).json({
      message: "please provide an email",
    });
  }

  const username = res.locals.user.username;

  if (!username) {
    return res.json({ message: "authentication failed!" });
  }

  const invitingUser = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (invitingUser?.enrolled === true) {
    return res.status(409).json({
      success: false,
      code: "ENROLLED",
      message:
        "Couldn't send invitation,This user is already enrolled in a company",
    });
  }

  const companyInfo = await prisma.user.findFirst({
    where: {
      username,
    },
    select: { company: true },
  });
  if (!companyInfo?.company) {
    return console.log("authentication failed!");
  }
  try {
    await prisma.joinToken.create({
      data: {
        email: userEmail,
        token: hashedToken,
        companyId: companyInfo?.company?.id,
        role,
        expiresAt: new Date(Date.now() + expiryTime),
      },
    });

    transporter.sendMail({
      from: companyEmail,
      to: userEmail,
      subject: `Invitation to Join ${companyInfo.company.companyName} on Reqora`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">You're Invited!</h2>
      <p>
        You have been invited to join <strong>${companyInfo.company.companyName}</strong> on Reqora.
      </p>
      <p>
        To accept this invitation and get started, please click the button below:
      </p>
      <p>
        <a href="${inviteUrl}" 
           style="
             display: inline-block;
             padding: 10px 20px;
             background-color: #2563eb;
             color: #ffffff;
             text-decoration: none;
             border-radius: 5px;
             font-weight: bold;
           ">
          Accept Invitation
        </a>
      </p>
      
      <p>If the button above does not work, you can also use the following link:</p>
      <p><a href="${inviteUrl}">${inviteUrl}</a></p>
      
      <br />
     <p>
  Best regards,<br />
  <strong>${companyInfo.company.companyName}</strong><br />
  via Reqora
</p>
    </div>
  `,
    });
    return res.status(200).json({
      success: true,
      code: "EMAIL_SENT",
      message: "Join inviation sent successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "couldnt send email",
    });
  }
};
export const generateCode = async (req: Request, res: Response) => {
  const { role, expiryTime } = req.body;
  if (!role || !expiryTime) {
    return res.json({ message: "please provide all fields" });
  }
  const joinCode = cryptoRandomString({ length: 10, type: "alphanumeric" });
  const hashedJoinCode = crypto
    .createHash("sha256")
    .update(joinCode)
    .digest("hex");
  const email = res.locals.user.email;

  try {
    const userInfo = await prisma.user.findUnique({
      where: { email },
    });
    if (!userInfo?.companyId) {
      return res.json({ message: "server error" });
    }
    await prisma.joinCode.create({
      data: {
        code: hashedJoinCode,
        companyId: userInfo.companyId,
        role,
        expiresAt: new Date(Date.now() + expiryTime),
      },
    });

    res.status(201).json({
      success: true,
      code: "CODE_GENERATED",
      joinCode,
      message: "code generated successfully",
    });
  } catch (err) {
    res.json({
      error: err,
      message: "server error",
    });
  }
};

export const joinByEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
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
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const retrivedToken = await prisma.joinToken.findUnique({
      where: { token: hashedToken },
    });

    if (!retrivedToken) {
      return res.status(404).json({
        hashedToken: hashedToken,
        retrivedToken: retrivedToken,
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
          where: { token: hashedToken },
        }),
      ]);
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        try {
          const { code, accessToken, NewRefreshToken } =
            await refresh(refreshToken);
          if (code === "USER_NOT_FOUND") {
            throw new Error("user not found");
          }
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });
          res.cookie("refreshToken", NewRefreshToken, {
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
      return res.status(500).json({ success: false, message: "wrong code" });
    }
    if (retrivedCode.used) {
      return res.json({
        success: false,
        message: "Code has already been used",
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
    await prisma.user.updateMany({
      where: { email },
      data: {
        role: retrivedCode.role,
        enrolled: true,
        companyId: retrivedCode.companyId,
      },
    });

    return res.status(201).json({
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

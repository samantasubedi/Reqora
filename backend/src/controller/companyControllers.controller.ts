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
    // if (refreshToken) {
    //   try {
    //     const { code, accessToken, NewRefreshToken } =
    //       await refresh(refreshToken);
    //     if (code === "USER_NOT_FOUND") {
    //       throw new Error("user not found");
    //     }
    //     res.cookie("accessToken", accessToken, {
    //       httpOnly: true,
    //       secure: true,
    //       sameSite: "strict",
    //       maxAge: 15 * 60 * 1000,
    //     });
    //     res.cookie("refreshToken", NewRefreshToken, {
    //       sameSite: "strict",
    //       httpOnly: true,
    //       secure: true,
    //       maxAge: 15 * 24 * 60 * 60 * 1000,
    //     });
    //   } catch (err) {
    //     res.clearCookie("refreshToken", {
    //       sameSite: "strict",
    //       httpOnly: true,
    //       secure: true,
    //     });
    //   }
    // }
    const { code, accessToken, NewRefreshToken } = await refresh(refreshToken);

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

    return res.status(200).json({
      success: true,
      code: "COMPANY_CREATED",
      message: "company created successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      code: "CREATION_FAILED",
      message: `failed to create company,${err.message}`,
    });
  }
};

import crypto from "crypto";
import { transporter } from "../lib/sendMail";
import { refresh } from "../services/authService.service";
import cryptoRandomString from "crypto-random-string";

import { handleRefresh } from "./authControllers.controller";

export const inviteToCompany = async (req: Request, res: Response) => {
  const { email: userEmail, role, message, expiryTime } = req.body;

  if (!userEmail || !role || !expiryTime) {
    res.status(400).json({
      message: "please provide all fields",
    });
  }
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const inviteUrl = `${frontendUrl}/getstarted/join/accept-invite?token=${token}`;
  const companyEmail = process.env.COMPANY_EMAIL;

  const username = res.locals.user.username;

  if (!username) {
    return res.json({ message: "authentication failed!" });
  }

  const invitedUser = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (invitedUser?.enrolled === true) {
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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You're Invited to ${companyInfo.company.companyName}</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4ff; font-family:'Georgia', serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(37,99,235,0.10);">

          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%); padding: 44px 40px 36px; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:#bfdbfe; font-family:'Arial', sans-serif; font-weight:600;">You have been invited to join</p>
              <h1 style="margin:0; font-size:30px; font-weight:700; color:#ffffff; font-family:'Georgia', serif; letter-spacing:-0.5px;">
                ${companyInfo.company.companyName}
              </h1>
              <p style="margin:10px 0 0; font-size:13px; color:#93c5fd; font-family:'Arial', sans-serif;">via Reqora</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 0;">

              <p style="margin:0 0 24px; font-size:16px; color:#374151; line-height:1.7; font-family:'Arial', sans-serif;">
                Hi there,
              </p>

              <p style="margin:0 0 24px; font-size:16px; color:#374151; line-height:1.7; font-family:'Arial', sans-serif;">
                You've been personally invited to join <strong style="color:#1e40af;">${companyInfo.company.companyName}</strong> on <strong>Reqora</strong>. Click the button below to accept and get started.
              </p>

              ${
                message
                  ? `
              <!-- Admin Message Block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="
                    background: #eff6ff;
                    border-left: 4px solid #2563eb;
                    border-radius: 0 10px 10px 0;
                    padding: 18px 22px;
                  ">
                    <p style="margin:0 0 6px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#2563eb; font-family:'Arial', sans-serif; font-weight:700;">Message from the team</p>
                    <p style="margin:0; font-size:15px; color:#1e3a8a; line-height:1.7; font-family:'Georgia', serif; font-style:italic;">
                      "${message}"
                    </p>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}" style="
                      display: inline-block;
                      padding: 15px 40px;
                      background: linear-gradient(135deg, #1e40af, #2563eb);
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: 700;
                      font-size: 16px;
                      font-family: 'Arial', sans-serif;
                      letter-spacing: 0.5px;
                      box-shadow: 0 4px 14px rgba(37,99,235,0.35);
                    ">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p style="font-size:13px; color:#6b7280; text-align:center; font-family:'Arial', sans-serif; margin:0 0 32px;">
                Button not working? 
                <a href="${inviteUrl}" style="color:#2563eb; text-decoration:underline; word-break:break-all;">${inviteUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px; border-top: 1px solid #e5e7eb;">
              <p style="margin:0; font-size:14px; color:#6b7280; font-family:'Arial', sans-serif; line-height:1.8;">
                Best regards,<br/>
                <strong style="color:#1e3a8a;">${companyInfo.company.companyName}</strong><br/>
                <span style="font-size:12px; color:#9ca3af;">Powered by Reqora</span>
              </p>
            </td>
          </tr>

          <!-- Bottom Bar -->
          <tr>
            <td style="background:#1e3a8a; padding:14px 40px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#93c5fd; font-family:'Arial', sans-serif; letter-spacing:1px;">
                This invitation was sent via Reqora · If you didn't expect this, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
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

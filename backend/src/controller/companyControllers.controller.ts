import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createCompany = async (req: Request, res: Response) => {
  const { companyName, email, address, size } = req.body;
  if (!companyName || !email || !address || !size) {
    return res.status(400).json({
      success: false,
      code: "INSUFFICIENT_DATA",
      message: "please provide all fields",
    });
  } else {
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

    const userData = await prisma.users.findFirst({
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
    const response = await prisma.company.create({
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
      await prisma.users.updateMany({
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

    res.status(200).json({
      success: true,
      code: "COMPANY_CREATED",
      message: "company created successfully",
    });
  }
};

import crypto from "crypto";
import { transporter } from "../lib/sendMail";

export const inviteToCompany = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
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

  const invitingUser = await prisma.users.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (invitingUser?.enrolled === true) {
    console.log(
      "hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    );
    return res.status(409).json({
      success: false,
      code: "ENROLLED",
      message:
        "Couldn't send invitation,This user is already enrolled in a company",
    });
  }

  const companyInfo = await prisma.users.findFirst({
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
        used: false,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
    });

    await transporter.sendMail({
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

const joinCompany = async (req: Request, res: Response) => {
  const token = req.body.token;
  const email = res.locals.users.email;
  try {
    const retrivedToken = await prisma.joinToken.findUnique({
      where: { email },
    });

    if (!retrivedToken) {
      return res.json({ message: "Token is expired!" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (retrivedToken.email === email && retrivedToken.token === hashedToken) {
      await prisma.users.updateMany({
        data: {
          enrolled: true,
          role: "employee",
          companyId: retrivedToken.companyId,
        },
      });

      return res.status(201).json({
        success: true,
        message: "You have been joined to the company",
        code: "JOIN_SUCCESSFULL",
      });
    }
  } catch (err) {
    res.json({ message: "couldnt join to the company" });
  }
};

import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reqora333@gmail.com",
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "medelinknotificaciones@gmail.com",
    pass: "ziwz zoqe ccww txnv",
  },
});

export default transporter;

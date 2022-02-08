const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  server: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
  from: process.env.GOOGLE_MAIL,
});

module.exports = transporter;

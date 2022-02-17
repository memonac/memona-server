const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  server: process.env.NODEMAILER_SERVER,
  host: process.env.NODEMAILER_HOST,
  port: process.env.GOOGLE_PORT,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
  from: process.env.GOOGLE_MAIL,
});

module.exports = transporter;

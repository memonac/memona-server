const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const nodemailerService = require("../services/nodemailer");
const transporter = require("../configs/nodemailer");

exports.postSendMail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const { memoroomId } = req.params;
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const url = `${process.env.PATH}/${memoroomId}/${process.env.INVITE_URL}?token=${token}`;

    const message = {
      from: process.env.GOOGLE_MAIL,
      to: email,
      subject: "memona C에서 당신을 초대합니다",
      html: `<div
      style='
      text-align: center; 
      width: 50%; 
      height: 60%;
      margin: 15%;
      padding: 20px;
      box-shadow: 1px 1px 3px 0px #999;
      '>
      <h2>안녕하세요.</h2>
      <h2>memona C에서 당신을 초대합니다.</h2>
      <br />
      <p>아래 링크를 누르면 초대된 Memo Room으로 이동합니다.</p>
      <a href=${url}>초대링크</a>
      </div>`,
    };

    transporter.sendMail(message, (err) => {
      if (err) {
        next(err);
      } else {
        res.json({
          result: "success",
        });
      }
    });
  } catch (err) {
    if (err.code === "EENVELOPE") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Check the email",
        },
      });

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

exports.postVerifyToken = async (req, res, next) => {
  const { token } = req.body;
  const { memoroomId } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    if (!decoded) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Token fail verified",
        },
      });

      return;
    }

    const user = await nodemailerService.verifyUser(email);

    if (!user) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Not found user",
        },
      });

      return;
    }

    await nodemailerService.updateMemoRoom(user, memoroomId);

    res.json({
      result: "success",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Expired invite token",
        },
      });

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

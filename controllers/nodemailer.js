const creatError = require("http-errors");
const jwt = require("jsonwebtoken");

const transporter = require("../configs/nodemailer");
const User = require("../models/User");

exports.postMail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const { memoroomId } = req.params;
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    const url = `${process.env.PATH}/${memoroomId}/${process.env.INVITE_URL}?token=${token}`;
console.log(token);
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

    await transporter.sendMail(message);

    return res.json({
      result: "success",
    });
  } catch (err) {
    next(creatError(500, "Invalid Server Error"));
  }
};

exports.postVerify = async (req, res, next) => {
  const { token } = req.body;
  const { memoroomId } = req.params;

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email }).lean().exec();
    console.log(user);

    if (!decoded) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Token fail verified",
        },
      });

      return;
    }

    if (!user) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Not fond user",
        },
      });

      return;
    }

    await User.findByIdAndUpdate(user._id, {
      $push: { rooms: memoroomId },
    });

    res.json({
      result: "success",
    });
  } catch (err) {
    console.log(err)
  }
}

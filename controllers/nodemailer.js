const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const nodemailerService = require("../services/nodemailer");
const transporter = require("../configs/nodemailer");
const { TOKEN } = require("../constants/tokenInfo");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../constants/responseMessage");

exports.postSendMail = async (req, res, next) => {
  const { email } = req.body;

  const user = await nodemailerService.verifyUser(email);

  if (!user) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.notFound,
      },
    });

    return;
  }

  try {
    const { memoroomId } = req.params;
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: TOKEN.invitationToken,
    });
    const url = `${process.env.CLIENT}/users/${memoroomId}/${process.env.INVITE_URL}?token=${token}`;

    const message = {
      from: process.env.GOOGLE_MAIL,
      to: email,
      subject: "You've been invited to MEMONA-C",
      html: `<div
      style='
      width: 50%;
      height: 60%;
      margin: 15%;
      padding: 30px;
      box-shadow: 1px 1px 3px 0px #999999;
      background: #fff1bd;
      text-align: center;
      '>
      <h2>WELCOME🥳</h2>
      <h2>You've been invited to MEMONA-C</h2>
      <br />
      <p>Click the link below to go to the invited Memo Room.</p>
      <a href=${url}>CLICK</a>
      </div>`,
    };

    await transporter.sendMail(message);

    res.json({
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.normalError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.sendMailFailure,
        },
      });

      return;
    }
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.postVerifyToken = async (req, res, next) => {
  const { memoroomId } = req.params;
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    if (!decoded) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidInviteToken,
        },
      });

      return;
    }

    const user = await nodemailerService.verifyUser(email);
    const userId = user._id;

    const updatedMemoRoom = await nodemailerService.updateMemoRoom(
      userId,
      memoroomId
    );

    const userInfo = {};

    updatedMemoRoom.participants.forEach((participant) => {
      userInfo[participant._id] = {
        name: participant.name,
        email: participant.email,
      };
    });

    res.json({
      result: RESULT_MESSAGE.success,
      data: {
        participants: userInfo,
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.tokenExpiredError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.expiredInviteToken,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

const createError = require("http-errors");

const { authenication } = require("../../configs/firebase");
const { TOKEN } = require("../../constants/tokenInfo");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../../constants/responseMessage");

const verifyFirebaseToken = async (req, res, next) => {
  const firebaseToken = req.headers[TOKEN.reqHeader].split(" ")[1];

  try {
    const { name, email } = await authenication.verifyIdToken(firebaseToken);

    res.locals.userInfo = { email, name };

    next();

    return;
  } catch (err) {
    if (err.code === ERROR_TYPE.authError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidFirebaseToken,
        },
      });

      return;
    }

    if (err.code === ERROR_TYPE.firebaseTokenExpiredError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.expiredFirebaseToken,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

module.exports = verifyFirebaseToken;

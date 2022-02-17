const jwt = require("jsonwebtoken");

const { TOKEN } = require("../../constants/tokenInfo");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../../constants/responseMessage");

const verifyToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  const cookieOptions = {
    httpOnly: true,
  };

  try {
    jwt.verify(accessToken, process.env.SECRET_KEY);

    next();
  } catch (err) {
    if (err.message === ERROR_TYPE.expiredJWT) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

        const { email, name } = decoded;

        const newAccessToken = jwt.sign(
          { email, name },
          process.env.SECRET_KEY,
          { expiresIn: TOKEN.accessTokenLimit }
        );

        res.cookie(TOKEN.accessToken, newAccessToken, cookieOptions);

        next();

        return;
      } catch (err) {
        if (err.message === ERROR_TYPE.malformedJWT) {
          res.status(400).json({
            result: RESULT_MESSAGE.fail,
            error: {
              message: ERROR_MESSAGE.invalidToken,
            },
          });

          return;
        }

        if (err.message === ERROR_TYPE.expiredJWT) {
          res.status(400).json({
            result: RESULT_MESSAGE.fail,
            error: {
              message: ERROR_MESSAGE.expiredToken,
            },
          });

          return;
        }
      }
    }
  }
};

module.exports = verifyToken;

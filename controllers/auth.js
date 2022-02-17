const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const userService = require("../services/auth");
const { TOKEN } = require("../constants/tokenInfo");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../constants/responseMessage");

exports.getLogin = async (req, res, next) => {
  const { userInfo } = res.locals;

  const cookieOptions = {
    httpOnly: true,
  };

  try {
    const { id, name } = await userService.createUser(userInfo);

    const accessToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: TOKEN.accessTokenLimit,
    });

    const refreshToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: TOKEN.refreshTokenLimit,
    });

    res.cookie(TOKEN.accessToken, accessToken, cookieOptions);
    res.cookie(TOKEN.refreshToken, refreshToken, cookieOptions);

    res.json({
      result: RESULT_MESSAGE.success,
      data: {
        userId: id,
        name,
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.validationError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.dataBaseError,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.postSignup = async (req, res, next) => {
  const { email, name } = req.body;
  const { userInfo } = res.locals;
  const cookieOptions = {
    httpOnly: true,
  };

  userInfo.name = name;

  try {
    const { id } = await userService.createUser(userInfo);

    const accessToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: TOKEN.accessTokenLimit,
    });

    const refreshToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: TOKEN.refreshTokenLimit,
    });

    res.cookie(TOKEN.accessToken, accessToken, cookieOptions);
    res.cookie(TOKEN.refreshToken, refreshToken, cookieOptions);

    res.json({
      result: RESULT_MESSAGE.success,
      data: {
        userId: id,
        email,
        name,
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.validationError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.dataBaseError,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.getLogout = (req, res, next) => {
  try {
    res.clearCookie(TOKEN.accessToken);
    res.clearCookie(TOKEN.refreshToken);

    res.json({
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

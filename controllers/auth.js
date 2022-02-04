const createError = require("http-errors");
const userService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  const { userInfo, accessToken, refreshToken } = res.locals;

  const cookieOptions = {
    path: "/",
    httpOnly: true,
  };

  res.cookie("token", accessToken, cookieOptions);

  if (userInfo) {
    userInfo.refreshToken = refreshToken;
  }

  try {
    await userService.createUser(userInfo);
  } catch (err) {
    if (err.name === "MongoServerError" || err.name === "ValidationError") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "DataBase Error",
        },
      });

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

exports.getLogout = async (req, res, next) => {};

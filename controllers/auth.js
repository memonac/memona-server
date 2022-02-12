const createError = require("http-errors");

const userService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  const { userInfo, accessToken, refreshToken } = res.locals;

  const cookieOptions = {
    httpOnly: true,
  };

  res.cookie("token", accessToken, cookieOptions);

  if (userInfo) {
    userInfo.refreshToken = refreshToken;
  }

  try {
    const user = await userService.createUser(userInfo);

    res.json({
      result: "success",
      data: {
        userId: user._id,
        name: user.name,
      },
    });
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

exports.postSignup = async (req, res, next) => {
  const { name } = req.body;

  const { userInfo, accessToken, refreshToken } = res.locals;

  const cookieOptions = {
    httpOnly: true,
  };

  res.cookie("token", accessToken, cookieOptions);

  if (userInfo) {
    userInfo.refreshToken = refreshToken;
  }

  userInfo.name = name;

  try {
    const userId = await userService.createUser(userInfo);

    res.json({
      result: "success",
      data: {
        userId,
      },
    });
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

exports.getLogout = (req, res, next) => {
  try {
    res.clearCookie("token");

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

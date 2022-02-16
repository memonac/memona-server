const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const userService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  const { userInfo } = res.locals;

  const cookieOptions = {
    httpOnly: true,
  };

  try {
    const { id, name } = await userService.createUser(userInfo);

    const accessToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const refreshToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      result: "success",
      data: {
        userId: id,
        name,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
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
  // const { name } = req.body;
  const { email, name } = req.body;
  const { userInfo } = res.locals;
  const cookieOptions = {
    httpOnly: true,
  };

  userInfo.name = name;

  try {
    const { id } = await userService.createUser(userInfo);

    const accessToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const refreshToken = await jwt.sign(userInfo, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      result: "success",
      data: {
        userId: id,
        email,
        name,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
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
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

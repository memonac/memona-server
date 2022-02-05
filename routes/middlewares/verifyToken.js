const createError = require("http-errors");

const { authenication } = require("../../configs/firebase");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const firebaseToken = req.headers["authorization"].split(" ")[1];

    try {
      const { name, email } = await authenication.verifyIdToken(firebaseToken);

      res.locals.userInfo = { email, name };

      const accessToken = await jwt.sign(
        { email, name },
        process.env.SECRET_KEY,
        { expiresIn: 24 * 60 * 60 * 1000 * 200000 }
      );

      const refreshToken = await jwt.sign(
        { email, name },
        process.env.SECRET_KEY,
        { expiresIn: 24 * 60 * 60 * 1000 * 2 }
      );

      res.locals.accessToken = accessToken;
      res.locals.refreshToken = refreshToken;

      next();

      return;
    } catch (err) {
      if (err.code === "auth/argument-error") {
        res.status(400).json({
          result: "fail",
          error: {
            message: "Invalid Firebase Token",
          },
        });

        return;
      }

      if (err.code === "auth/id-token-expired") {
        res.status(400).json({
          result: "fail",
          error: {
            message: "Expired Firebase Token",
          },
        });

        return;
      }

      next(createError(500, "Invalid Server Error"));
    }
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      next();

      return;
    }
  } catch (err) {
    if (err.message === "jwt malformed") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Invaild Verify Token",
        },
      });

      return;
    }

    if (err.message === "jwt expired") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Expired Token",
        },
      });

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

module.exports = verifyToken;

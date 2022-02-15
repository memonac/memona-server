const createError = require("http-errors");

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  const cookieOptions = {
    httpOnly: true,
  };

  try {
    jwt.verify(accessToken, process.env.SECRET_KEY);

    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

        const { email, name } = decoded;

        const newAccessToken = jwt.sign(
          { email, name },
          process.env.SECRET_KEY,
          { expiresIn: "2h" }
        );

        res.cookie("accessToken", newAccessToken, cookieOptions);

        next();

        return;
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
      }
    }
  }
};

module.exports = verifyToken;

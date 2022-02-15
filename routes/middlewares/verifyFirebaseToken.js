const createError = require("http-errors");
const { authenication } = require("../../configs/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  const firebaseToken = req.headers["authorization"].split(" ")[1];

  try {
    const { name, email } = await authenication.verifyIdToken(firebaseToken);

    res.locals.userInfo = { email, name };

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
};

module.exports = verifyFirebaseToken;

const { authenication } = require("../../configs/firebase");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const firebaseToken = req.headers["authorization"].split(" ")[1];

    try {
      const { name, email } = await authenication.verifyIdToken(firebaseToken);
      res.locals.userInfo = { email, name };

      next();
    } catch (err) {}
  }
};

module.exports = verifyToken;

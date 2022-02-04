const userService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  const email = "";

  try {
    await userService.createUser(email);
  } catch (err) {}
};

exports.getLogout = async (req, res, next) => {
  // 로그아웃 요청
};

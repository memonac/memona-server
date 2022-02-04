const userService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  const { userInfo } = res.locals;

  try {
    await userService.createUser(userInfo);
  } catch (err) {}
};

exports.getLogout = async (req, res, next) => {
  // 로그아웃 요청
};

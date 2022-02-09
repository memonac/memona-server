const { body } = require("express-validator");

const checkEmail = [body("email", "이메일을 확인해주세요").exists().isEmail()];

module.exports = checkEmail;

const { body } = require("express-validator");

const checkEmail = [body("email", "Please check Email").exists().isEmail()];

module.exports = checkEmail;

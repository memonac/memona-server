const { body } = require("express-validator");

const checkInputValue = [
  body("name", "name must be required").notEmpty(),
];

module.exports = checkInputValue;

const { body } = require("express-validator");

const checkMemoNameValue = [body("name", "name must be required").notEmpty()];
const checkChatTextValue = [body("text", "text must be string").isString()];
const checkEmail = [body("email", "Please check Email").exists().isEmail()];
const checkNewMemoInputValue = [
  body("alarmDate", "AlramDate must be String")
    .optional({ checkFalsy: true })
    .isString(),
  body("memoColor", "Memo Color should be colorCode").isHexColor(),
  body("memoTags", "Memo Tags should be string").isString(),
  body("memoType", "Memo Type should be text, image or voice").custom(
    (value) => {
      return value === "text" || value === "image" || value === "voice";
    }
  ),
];

const checkMemoStyleValue = [
  body("alarmDate", "AlramDate must be String")
    .optional({ checkFalsy: true })
    .isString(),
  body("memoColor", "Memo Color should be colorCode").isHexColor(),
  body("memoTags", "Memo Tags should be string").isString(),
];

const checkSizeValue = [
  body("width", "Width should be number").isNumeric(),
  body("height", "Height should be number").isNumeric(),
];

const checkLocationValue = [
  body("left", "Left should be number").isNumeric(),
  body("top", "Top should be number").isNumeric(),
];

module.exports = {
  checkMemoNameValue,
  checkChatTextValue,
  checkEmail,
  checkNewMemoInputValue,
  checkMemoStyleValue,
  checkSizeValue,
  checkLocationValue,
};

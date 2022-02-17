const { body } = require("express-validator");
const {
  REQ_BODY_VALIDATION,
} = require("../../constants/dataValidationMessage");

const checkMemoNameValue = [
  body("name", REQ_BODY_VALIDATION.roomNameError).notEmpty(),
];
const checkChatTextValue = [
  body("text", REQ_BODY_VALIDATION.chatTextError).isString(),
];
const checkEmail = [
  body("email", REQ_BODY_VALIDATION.emailError).exists().isEmail(),
];
const checkNewMemoInputValue = [
  body("alarmDate", REQ_BODY_VALIDATION.alarmDateError)
    .optional({ checkFalsy: true })
    .isString(),
  body("memoColor", REQ_BODY_VALIDATION.memoColorError).isHexColor(),
  body("memoTags", REQ_BODY_VALIDATION.memoTagsError).isString(),
  body("memoType", REQ_BODY_VALIDATION.memoTypeError).custom((value) => {
    return value === "text" || value === "image" || value === "voice";
  }),
];

const checkMemoStyleValue = [
  body("alarmDate", REQ_BODY_VALIDATION.alarmDateError)
    .optional({ checkFalsy: true })
    .isString(),
  body("memoColor", REQ_BODY_VALIDATION.memoColorError).isHexColor(),
  body("memoTags", REQ_BODY_VALIDATION.memoTagsError).isString(),
];

const checkSizeValue = [
  body("width", REQ_BODY_VALIDATION.memoWidthError).isNumeric(),
  body("height", REQ_BODY_VALIDATION.memoHeightError).isNumeric(),
];

const checkLocationValue = [
  body("left", REQ_BODY_VALIDATION.memoLeftError).isNumeric(),
  body("top", REQ_BODY_VALIDATION.memoTopError).isNumeric(),
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

const { body } = require("express-validator");

const checkNewMemoInputValue = [
  body("alarmDateInfo", "AlramDate must be date")
    .optional({ checkFalsy: true })
    .custom((value) => {
      return !isNaN(Date.parse(value));
    }),
  body("memoColor", "Memo Color should be colorCode").isHexColor(),
  body("memoTags", "Memo Tags should be string").isString(),
  body("memoType", "Memo Type should be text, image or voice").custom(
    (value) => {
      return value === "text" || value === "image" || value === "voice";
    }
  ),
  // body("imageFile", "Image File should be uploaded with url format").optional({checkFalsy: true}).isURL()
];

module.exports = checkNewMemoInputValue;

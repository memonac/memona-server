const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const memoRoomDetailController = require("../controllers/memoRoomDetail");
const nodemailerController = require("../controllers/nodemailer");

const validator = require("./middlewares/validator");
const {
  checkMemoNameValue,
  checkEmail,
  checkNewMemoInputValue,
  checkMemoStyleValue,
  checkSizeValue,
  checkLocationValue,
} = require("./middlewares/inputValidaionList");
const uploadToAwsS3 = require("../routes/middlewares/fileUploadToAWS");
const chatController = require("../controllers/chat");

router.get("/:userId/memorooms", memoRoomController.getAllMemoRooms);
router.post(
  "/:userId/memorooms",
  validator(checkMemoNameValue),
  memoRoomController.addNewMemoRoom
);
router.get(
  "/:userId/memorooms/:memoroomId",
  memoRoomDetailController.getAllMemoRoomDetail
);
router.put(
  "/:userId/memorooms/:memoroomId",
  validator(checkMemoNameValue),
  memoRoomController.updateMemoRoomTitle
);
router.delete(
  "/:userId/memorooms/:memoroomId",
  memoRoomController.removeMemoRoom
);
router.post(
  "/:userId/memorooms/:memoroomId/invite",
  validator(checkEmail),
  nodemailerController.postSendMail
);
router.post("/:memoroomId/invite", nodemailerController.postVerifyToken);
router.post(
  "/:userId/memorooms/:memoroomId/memo",
  uploadToAwsS3.single("imageFile"),
  validator(checkNewMemoInputValue),
  memoRoomDetailController.addNewMemo
);
router.delete(
  "/:userId/memorooms/:memoroomId/memos/:memoId",
  memoRoomDetailController.deleteMemo
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/text",
  memoRoomDetailController.updateMemoText
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/style",
  validator(checkMemoStyleValue),
  memoRoomDetailController.updateMemoStyle
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/size",
  validator(checkSizeValue),
  memoRoomDetailController.updateMemoSize
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/location",
  validator(checkLocationValue),
  memoRoomDetailController.updateMemoLocation
);

router.get(
  "/:userId/memorooms/:memoroomId/chats/:chatLastIndex",
  chatController.getChats
);

module.exports = router;

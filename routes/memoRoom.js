const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const memoRoomDetailController = require("../controllers/memoRoomDetail");
const nodemailerController = require("../controllers/nodemailer");
const chatController = require("../controllers/chat");
const uploadToAwsS3 = require("../routes/middlewares/fileUploadToAWS");
const audioUploadToAwsS3 = require("./middlewares/audioUploadToAWS");
const validator = require("./middlewares/validator");
const {
  checkMemoNameValue,
  checkChatTextValue,
  checkEmail,
  checkNewMemoInputValue,
  checkMemoStyleValue,
  checkSizeValue,
  checkLocationValue,
} = require("./middlewares/inputValidaionList");

const verifyToken = require("./middlewares/verifyToken");

router.get(
  "/:userId/memorooms",
  verifyToken,
  memoRoomController.getAllMemoRooms
);
router.post(
  "/:userId/memorooms",
  verifyToken,
  validator(checkMemoNameValue),
  memoRoomController.addNewMemoRoom
);
router.get(
  "/:userId/memorooms/:memoroomId",
  verifyToken,
  memoRoomDetailController.getAllMemoRoomDetail
);
router.put(
  "/:userId/memorooms/:memoroomId",
  verifyToken,
  validator(checkMemoNameValue),
  memoRoomController.updateMemoRoomTitle
);
router.delete(
  "/:userId/memorooms/:memoroomId",
  verifyToken,
  memoRoomController.removeMemoRoom
);
router.post(
  "/:userId/memorooms/:memoroomId/invite",
  verifyToken,
  validator(checkEmail),
  checkEmail,
  nodemailerController.postSendMail
);
router.post(
  "/:memoroomId/invite",
  verifyToken,
  nodemailerController.postVerifyToken
);
router.post(
  "/:userId/memorooms/:memoroomId/memo",
  verifyToken,
  uploadToAwsS3.single("imageFile"),
  validator(checkNewMemoInputValue),
  memoRoomDetailController.addNewMemo
);
router.delete(
  "/:userId/memorooms/:memoroomId/memos/:memoId",
  verifyToken,
  memoRoomDetailController.deleteMemo
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/text",
  verifyToken,
  validator(checkChatTextValue),
  memoRoomDetailController.updateMemoText
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/style",
  verifyToken,
  validator(checkMemoStyleValue),
  memoRoomDetailController.updateMemoStyle
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/size",
  verifyToken,
  validator(checkSizeValue),
  memoRoomDetailController.updateMemoSize
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/location",
  verifyToken,
  validator(checkLocationValue),
  memoRoomDetailController.updateMemoLocation
);

router.get(
  "/:userId/memorooms/:memoroomId/chats/:chatLastIndex",
  verifyToken,
  chatController.getChats
);

router.post(
  "/:userId/memorooms/:memoroomId/memos/:memoId/sound",
  verifyToken,
  audioUploadToAwsS3.single("audio"),
  memoRoomDetailController.addAudioFile
);

module.exports = router;

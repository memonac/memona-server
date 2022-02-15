// routes
const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const memoRoomDetailController = require("../controllers/memoRoomDetail");
const nodemailerController = require("../controllers/nodemailer");
const checkInputValue = require("./middlewares/checkInputValue");
const checkNewMemoInputValue = require("./middlewares/checkNewMemoInputValue");
const checkEmail = require("./middlewares/checkEmail");
const uploadToAwsS3 = require("../routes/middlewares/fileUploadToAWS");
const chatController = require("../controllers/chat");

const verifyToken = require("./middlewares/verifyToken");

router.get(
  "/:userId/memorooms",
  verifyToken,
  memoRoomController.getAllMemoRooms
);
router.post(
  "/:userId/memorooms",
  verifyToken,
  checkInputValue,
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
  checkInputValue,
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
  checkNewMemoInputValue,
  memoRoomDetailController.addNewMemo
);
router.delete(
  "/:userId/memorooms/:memoroomId/memos/:memoId",
  verifyToken,
  memoRoomDetailController.deleteMemo
);

// router.get("/:userId/memorooms/:memoroomId/memo/:memoId", memoRoomController.getMemoRoom);
// router.put("/:userId/memorooms/:memoroomId/:memoId", memoRoomController.getMemoRoom);

router.get(
  "/:userId/memorooms/:memoroomId/chats/:chatLastIndex",
  chatController.getChats
);

module.exports = router;

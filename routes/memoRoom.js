const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const memoRoomDetailController = require("../controllers/memoRoomDetail");
const nodemailerController = require("../controllers/nodemailer");
const checkInputValue = require("./middlewares/checkInputValue");
const checkNewMemoInputValue = require("./middlewares/checkNewMemoInputValue");
const checkEmail = require("./middlewares/checkEmail");
const uploadToAwsS3 = require("../routes/middlewares/fileUploadToAWS");
const audioUploadToAwsS3 = require("../routes/middlewares/audioUplodadToAWS");

router.get("/:userId/memorooms", memoRoomController.getAllMemoRooms);
router.post(
  "/:userId/memorooms",
  checkInputValue,
  memoRoomController.addNewMemoRoom
);
router.get(
  "/:userId/memorooms/:memoroomId",
  memoRoomDetailController.getAllMemoRoomDetail
);
router.put(
  "/:userId/memorooms/:memoroomId",
  checkInputValue,
  memoRoomController.updateMemoRoomTitle
);
router.delete(
  "/:userId/memorooms/:memoroomId",
  memoRoomController.removeMemoRoom
);
router.post(
  "/:userId/memorooms/:memoroomId/invite",
  checkEmail,
  nodemailerController.postSendMail
);
router.post("/:memoroomId/invite", nodemailerController.postVerifyToken);

router.post(
  "/:userId/memorooms/:memoroomId/memo",
  uploadToAwsS3.single("imageFile"),
  checkNewMemoInputValue,
  memoRoomDetailController.addNewMemo
);

router.delete(
  "/:userId/memorooms/:memoroomId/memos/:memoId",
  memoRoomDetailController.deleteMemo
);

router.post(
  "/:userId/memorooms/:memoroomId/memos/:memoId/sound",
  audioUploadToAwsS3.single("audio"),
  memoRoomDetailController.addAudioFile
);

// router.get("/:userId/memorooms/:memoroomId/memo/:memoId", memoRoomController.getMemoRoom);
// router.put("/:userId/memorooms/:memoroomId/:memoId", memoRoomController.getMemoRoom);

module.exports = router;

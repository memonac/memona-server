const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const memoRoomDetailController = require("../controllers/memoRoomDetail");
const nodemailerController = require("../controllers/nodemailer");
const checkInputValue = require("./middlewares/checkInputValue");
const checkNewMemoInputValue = require("./middlewares/checkNewMemoInputValue");
const checkEmail = require("./middlewares/checkEmail");
const uploadToAwsS3 = require("../routes/middlewares/fileUploadToAWS");

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
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/text",
  memoRoomDetailController.updateMemoText
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/style",
  memoRoomDetailController.updateMemoStyle
);
router.put(
  "/:userId/memorooms/:memoroomId/memos/:memoId/size",
  memoRoomDetailController.updateMemoSize
);
// router.put(
//   "/:userId/memorooms/:memoroomId/memos/:memoId/location",
//   memoRoomDetailController.updateMemoLocation
// );

module.exports = router;

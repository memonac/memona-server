const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");
const checkInputValue = require("./middlewares/checkInputValue");

router.get("/:userId/memorooms", memoRoomController.getAllMemoRooms);
router.post(
  "/:userId/memorooms",
  checkInputValue,
  memoRoomController.addNewMemoRoom
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
// router.post("/:userId/memorooms/:memoroomId/memo", memoRoomController.getMemoRoom);
// router.get("/:userId/memorooms/:memoroomId/memo/:memoId", memoRoomController.getMemoRoom);
// router.put("/:userId/memorooms/:memoroomId/:memoId", memoRoomController.getMemoRoom);
// router.delete("/:userId/memorooms/:memoroomId/:memoId", memoRoomController.getMemoRoom);

module.exports = router;

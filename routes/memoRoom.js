const express = require("express");
const router = express.Router();

const memoRoomController = require("../controllers/memoRoom");

router.get("/:userId", memoRoomController.getMemoRoom);

module.exports = router;

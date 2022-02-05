const mongoose = require("mongoose");
const createError = require("http-errors");

const memoRoomService = require("../services/memoRoom");

exports.getMemoRoom = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const memoRoom = await memoRoomService.getMemoRoom(userId);

      res.json({
        result: "success",
        data: memoRoom,
      });
    }
  } catch (err) {
    if (err.name === "MongoServerError" || err.name === "ValidationError") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Database Error",
        },
      });

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

const { Mongoose } = require("mongoose");
const createError = require("http-errors");

const memoRoomService = require("../services/memoRoom");

exports.getAllMemoRooms = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Validation Error",
        },
      });

      return;
    }

    const memoRoom = await memoRoomService.getMemoRoom(userId);

    res.status(200).json({
      result: "success",
      data: memoRoom,
    });
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

exports.addNewMemoRoom = async (req, res, next) => {};
exports.getMemoRoomTitle = async (req, res, next) => {};
exports.updateMemoRoomTitle = async (req, res, next) => {};
exports.removeMemoRoom = async (req, res, next) => {};

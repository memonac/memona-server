const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createHttpError = require("http-errors");

const memoRoomDetailService = require("../services/memoRoomDetail");

exports.getAllMemoRoomDetail = async (req, res, next) => {
  const { userId, memoroomId } = req.params;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: "fail",
      error: {
        message: "Not Valid ObjectId",
      },
    });

    return;
  }

  try {
    const memoRoomDetail = await memoRoomDetailService.getDetailInfo(
      userId,
      memoroomId
    );

    res.json({
      result: "success",
      data: memoRoomDetail,
    });
  } catch (err) {
    if (err.name === "MongoServerError") {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Database Error",
        },
      });
    }

    next(createHttpError(500, "Invalid Server Error"));
  }
};

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");
const { validationResult } = require("express-validator");

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

      return;
    }

    next(createError(500, "Invalid Server Error"));
  }
};

exports.addNewMemo = async (req, res, next) => {
  const { userId, memoroomId } = req.params;
  const { alarmDateInfo, imageFile, memoColor, memoTags, memoType } = req.body;

  const errors = validationResult(req);

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: "fail",
      error: {
        message: "Not Valid ObjectId",
      },
    });

    return;
  }

  if (!errors.isEmpty()) {
    const inputError = errors.errors[0];

    res.status(400).json({
      result: "fail",
      error: {
        message: inputError.msg,
      },
    });

    return;
  }

  try {
    const newMemo = await memoRoomDetailService.addNewMemo({
      userId,
      memoroomId,
      alarmDateInfo,
      imageFile,
      memoColor,
      memoTags,
      memoType,
    });

    res.json({
      result: "success",
      data: {
        newMemo,
      },
    });
  } catch (err) {
    if (err.name === "MongoServerError") {
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

exports.deleteMemo = async (req, res, next) => {
  const { userId, memoroomId, memoId } = req.params;

  if (
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(memoroomId) ||
    !ObjectId.isValid(memoId)
  ) {
    res.status(400).json({
      result: "fail",
      error: {
        message: "Not Valid ObjectId",
      },
    });

    return;
  }

  try {
    await memoRoomDetailService.deleteMemo({ memoroomId, memoId });

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

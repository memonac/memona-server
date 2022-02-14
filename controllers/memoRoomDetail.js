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
    next(createError(500, "Invalid Server Error"));
  }
};

exports.addNewMemo = async (req, res, next) => {
  const { userId, memoroomId } = req.params;
  const { alarmDate, alarmTime, memoColor, memoTags, memoType } = req.body;
  const awsImageUrl = req.file ? req.file.location : "";

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
      alarmDate,
      imageFile: awsImageUrl,
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

exports.updateMemoStyle = async (req, res, next) => {
  const { userId, memoroomId, memoId } = req.params;
  const { memoColor, alarmDate, memoTags } = req.body;

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
    await memoRoomDetailService.updateMemoStyle({
      memoId,
      memoColor,
      alarmDate,
      memoTags,
    });

    res.json({
      result: "success",
      data: {
        memoId,
        memoColor,
        alarmDate,
        memoTags: memoTags.split(" "),
      },
    });
  } catch (err) {
    console.log(err.stack);
    next(createError(500, "Invalid Server Error"));
  }
};

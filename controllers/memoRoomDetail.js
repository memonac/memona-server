const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

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
  const { alarmDate, memoColor, memoTags, memoType } = req.body;
  const awsImageUrl = req.file ? req.file.location : "";

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

exports.updateMemoText = async (req, res, next) => {
  const { userId, memoroomId, memoId } = req.params;
  const { text } = req.body;

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
    await memoRoomDetailService.updateMemoText({ memoId, text });

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
    next(createError(500, "Invalid Server Error"));
  }
};

exports.updateMemoSize = async (req, res, next) => {
  const { userId, memoroomId, memoId } = req.params;
  const { width, height } = req.body;

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
    await memoRoomDetailService.updateMemoSize({
      memoId,
      width,
      height,
    });

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

exports.updateMemoLocation = async (req, res, next) => {
  const { userId, memoroomId, memoId } = req.params;
  const { left, top } = req.body;

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
    await memoRoomDetailService.updateMemoLocation({
      memoId,
      left,
      top,
    });

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

exports.leaveMemoRoom = async (req, res, next) => {
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
    await memoRoomDetailService.leaveMemoRoom({
      userId,
      memoroomId,
    });

    res.json({
      result: "success",
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

exports.addAudioFile = async (req, res, next) => {
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
    const awsAudioUrl = req.file ? req.file.location : "";
    await memoRoomDetailService.addAudioFile({
      memoId,
      awsAudioUrl,
    });

    res.json({
      result: "success",
      data: {
        memoId,
        audioUrl: awsAudioUrl,
      },
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

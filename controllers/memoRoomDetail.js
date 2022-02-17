const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const memoRoomDetailService = require("../services/memoRoomDetail");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../constants/responseMessage");

exports.getAllMemoRoomDetail = async (req, res, next) => {
  const { userId, memoroomId } = req.params;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
      data: memoRoomDetail,
    });
  } catch (err) {
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.addNewMemo = async (req, res, next) => {
  const { userId, memoroomId } = req.params;
  const { alarmDate, memoColor, memoTags, memoType } = req.body;
  const awsImageUrl = req.file ? req.file.location : "";

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
      data: {
        newMemo,
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.validationError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.validationError,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
      },
    });

    return;
  }

  try {
    await memoRoomDetailService.deleteMemo({ memoroomId, memoId });

    res.json({
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.validationError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.validationError,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
      },
    });

    return;
  }

  try {
    await memoRoomDetailService.updateMemoText({ memoId, text });

    res.json({
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.castError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidDataCasting,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
      data: {
        memoId,
        memoColor,
        alarmDate,
        memoTags: memoTags.split(" "),
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.castError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidDataCasting,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.castError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidDataCasting,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.castError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidDataCasting,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.leaveMemoRoom = async (req, res, next) => {
  const { userId, memoroomId } = req.params;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.castError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidDataCasting,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
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
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
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
      result: RESULT_MESSAGE.success,
      data: {
        memoId,
        audioUrl: awsAudioUrl,
      },
    });
  } catch (err) {
    if (err.name === ERROR_TYPE.validationError) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.validationError,
        },
      });

      return;
    }

    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

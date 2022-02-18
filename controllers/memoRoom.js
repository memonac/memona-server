const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const memoRoomService = require("../services/memoRoom");
const {
  ERROR_TYPE,
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../constants/responseMessage");

exports.getAllMemoRooms = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        result: RESULT_MESSAGE.fail,
        error: {
          message: ERROR_MESSAGE.invalidObjectId,
        },
      });

      return;
    }

    const memoRoom = await memoRoomService.getAllMemoRoom(userId);

    res.json({
      result: RESULT_MESSAGE.success,
      data: memoRoom,
    });
  } catch (err) {
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.addNewMemoRoom = async (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
      },
    });

    return;
  }

  try {
    const newMemoRoomId = await memoRoomService.addNewMemoRoom(userId, name);

    res.json({
      result: RESULT_MESSAGE.success,
      data: {
        newMemoRoomId,
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

    console.log(err.stack);
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

exports.updateMemoRoomTitle = async (req, res, next) => {
  const { userId, memoroomId } = req.params;
  const { name } = req.body;

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
    await memoRoomService.updateMemoRoomTitle(memoroomId, name);

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

exports.removeMemoRoom = async (req, res, next) => {
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
    const newMemoRooms = await memoRoomService.removeMemoRoom(
      userId,
      memoroomId
    );

    res.json({
      result: RESULT_MESSAGE.success,
      data: newMemoRooms,
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

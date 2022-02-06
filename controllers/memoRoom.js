const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");
const { validationResult } = require("express-validator");

const memoRoomService = require("../services/memoRoom");

exports.getAllMemoRooms = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        result: "fail",
        error: {
          message: "Not Valid ObjectId",
        },
      });

      return;
    }

    const memoRoom = await memoRoomService.getAllMemoRoom(userId);

    res.json({
      result: "success",
      data: memoRoom,
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

exports.addNewMemoRoom = async (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;

  const errors = validationResult(req);

  if (!ObjectId.isValid(userId)) {
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
    await memoRoomService.addNewMemoRoom(userId, name);

    res.json({
      result: "success",
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

exports.updateMemoRoomTitle = async (req, res, next) => {
  const { userId, memoroomId } = req.params;
  const { name } = req.body;

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
    await memoRoomService.updateMemoRoomTitle(memoroomId, name);

    res.json({
      result: "success",
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

//DELETE /:userId/memorooms/:memoroomId
exports.removeMemoRoom = async (req, res, next) => {
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
    await memoRoomService.removeMemoRoom(memoroomId);

    res.json({
      result: "success",
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

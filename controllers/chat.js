const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const chatService = require("../services/chat");
const {
  ERROR_MESSAGE,
  RESULT_MESSAGE,
} = require("../constants/responseMessage");

exports.getChats = async (req, res, next) => {
  const { memoroomId, chatLastIndex } = req.params;

  if (!ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: RESULT_MESSAGE.fail,
      error: {
        message: ERROR_MESSAGE.invalidObjectId,
      },
    });

    return;
  }

  try {
    const nextChatInfo = await chatService.getNextChatList(
      memoroomId,
      chatLastIndex
    );

    res.json({
      result: RESULT_MESSAGE.success,
      data: nextChatInfo,
    });
  } catch (err) {
    next(createError(500, ERROR_MESSAGE.invalidServerError));
  }
};

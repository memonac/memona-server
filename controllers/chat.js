const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const chatService = require("../services/chat");

exports.getChats = async (req, res, next) => {
  const { memoroomId, chatLastIndex } = req.params;

  if (!ObjectId.isValid(memoroomId)) {
    res.status(400).json({
      result: "fail",
      error: {
        message: "Not Valid ObjectId",
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
      result: "success",
      data: nextChatInfo,
    });
  } catch (err) {
    next(createError(500, "Invalid Server Error"));
  }
};

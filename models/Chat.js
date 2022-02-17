const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const Conversation = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      required: [true, SCHEMA_MESSAGE.userIdError],
    },
    name: {
      type: String,
      required: [true, SCHEMA_MESSAGE.userNameError],
    },
  },
  message: {
    type: String,
    required: [true, SCHEMA_MESSAGE.messageError],
  },
  sendDate: {
    type: Date,
    required: [true, SCHEMA_MESSAGE.sendDateError],
  },
});

const ChatSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "MemoRoom",
    required: [true, SCHEMA_MESSAGE.roomIdError],
  },
  conversation: [Conversation],
});

module.exports = mongoose.model("Chat", ChatSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const Conversation = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      required: [true, "UserId must be required"],
    },
    name: {
      type: String,
      required: [true, "UserName must be required"],
    },
  },
  message: {
    type: String,
    required: [true, "Comment must be required."],
  },
  sendDate: {
    type: Date,
    required: [true, "sendDate must be required."],
  },
});

const ChatSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "MemoRoom",
    required: [true, "RoomId must be required."],
  },
  conversation: [Conversation],
});

module.exports = mongoose.model("Chat", ChatSchema);

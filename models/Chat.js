const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "MemoRoom",
    required: [true, "RoomId must be required."],
  },
  conversation: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User must be required."],
      },
      comment: {
        type: String,
        required: [true, "Comment must be required."],
      },
      time: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);

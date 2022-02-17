const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const MemoRoomSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, SCHEMA_MESSAGE.ownerError],
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  memos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Memo",
    },
  ],
  slackToken: {
    type: String,
    unique: [true, SCHEMA_MESSAGE.slackTokenError],
  },
  name: {
    type: String,
    required: [true, SCHEMA_MESSAGE.roomNameError],
  },
});

module.exports = mongoose.model("MemoRoom", MemoRoomSchema);

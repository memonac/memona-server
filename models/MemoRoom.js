const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemoRoomSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, "owner must be required"],
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
    unique: [true, "slackToken must be unique"],
  },
  name: {
    type: String,
    required: [true, "name must be required"],
  },
});

module.exports = mongoose.model("MemoRoom", MemoRoomSchema);

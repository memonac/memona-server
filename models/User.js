const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email must be unique."],
    required: true,
  },
  name: {
    type: String,
    required: [true, "name must be required."],
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "MemoRoom",
    },
  ],
  refreshToken: String,
});

module.exports = mongoose.model("User", UserSchema);

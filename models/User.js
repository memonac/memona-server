const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, SCHEMA_MESSAGE.userEmailError],
    required: true,
  },
  name: {
    type: String,
    required: [true, SCHEMA_MESSAGE.userNameError],
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

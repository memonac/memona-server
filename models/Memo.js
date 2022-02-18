const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const MemoSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "MemoRoom",
  },
  author: {
    type: Schema.Types.ObjectId,
    required: [true, SCHEMA_MESSAGE.authorError],
  },
  formType: {
    type: String,
    required: [true, SCHEMA_MESSAGE.formTypeError],
  },
  content: String,
  location: [
    {
      type: Number,
      required: [true, SCHEMA_MESSAGE.locationError],
    },
  ],
  size: [
    {
      type: Number,
      required: [true, SCHEMA_MESSAGE.sizeError],
    },
  ],
  color: {
    type: String,
    required: [true, SCHEMA_MESSAGE.colorError],
  },
  alarmDate: String,
  tags: [
    {
      type: String,
      unique: false,
    },
  ],
});

MemoSchema.path("location").validate((value) => {
  return value.length === 2;
});

MemoSchema.path("size").validate((value) => {
  return value.length === 2;
});

module.exports = mongoose.model("Memo", MemoSchema);

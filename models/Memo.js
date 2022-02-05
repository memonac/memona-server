const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemoSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: [true, "author must be require"],
  },
  formType: {
    type: String,
    required: [true, "formType must be require"],
  },
  content: {
    type: String,
    required: [true, "formType must be require"],
  },
  location: [
    {
      type: Number,
      required: [true, "location must be require"],
    },
  ],
  size: [
    {
      type: Number,
      required: [true, "size must be require"],
    },
  ],
  color: {
    type: String,
    required: [true, "color must be require"],
  },
  alarmDate: Date,
  tags: [
    {
      type: String,
      unique: true,
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

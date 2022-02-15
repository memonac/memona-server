const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");

exports.verifyUser = async (email) => {
  return await User.findOne({ email: email }).lean().exec();
};

exports.updateMemoRoom = async (userId, memoroomId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { rooms: memoroomId },
  });

  return await MemoRoom.findByIdAndUpdate(
    memoroomId,
    {
      $push: { participants: userId },
    },
    { new: true }
  ).populate("participants");
};

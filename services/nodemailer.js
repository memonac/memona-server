const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");

exports.verifyUser = async (email) => {
  const user = await User.findOne({ email: email }).lean().exec();

  return user;
};

exports.updateMemoRoom = async ({ user, memoroomId }) => {
  await User.findByIdAndUpdate(user._id, {
    $push: { rooms: memoroomId },
  });

  await MemoRoom.findByIdAndUpdate(memoroomId, {
    $push: { participants: user._id },
  });
};

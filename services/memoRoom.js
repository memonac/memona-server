const User = require("../models/User");
const Memo = require("../models/Memo");
const MemoRoom = require("../models/MemoRoom");
const Chat = require("../models/Chat");
const s3 = require("../configs/awsS3");
const formatMemoRoomData = require("../utils/formatMemoRoomData");

exports.getAllMemoRoom = async (userId) => {
  const targetUser = await User.findById(userId).populate({
    path: "rooms",
    populate: { path: "memos" },
  });

  return formatMemoRoomData(targetUser);
};

exports.addNewMemoRoom = async (userId, roomName) => {
  const newMemoRoom = await MemoRoom.create({
    owner: userId,
    participants: [userId],
    name: roomName,
  });

  await User.findByIdAndUpdate(userId, {
    $push: { rooms: newMemoRoom._id },
  }).exec();

  return newMemoRoom._id;
};

exports.updateMemoRoomTitle = async (memoRoomId, roomName) => {
  await MemoRoom.findByIdAndUpdate(memoRoomId, { name: roomName }).exec();
};

exports.removeMemoRoom = async (userId, memoRoomId) => {
  const Memos = await Memo.find({ room: memoRoomId }).lean().exec();

  Memos.forEach((memo) => {
    if (memo.formType !== "text") {
      const splitedUrl = memo.content.split("/");

      s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: splitedUrl[splitedUrl.length - 1],
        },
        (err) => {
          if (err) throw err;
        }
      );
    }
  });

  await Memo.deleteMany({ room: memoRoomId }).exec();
  await Chat.deleteMany({ room: memoRoomId }).exec();
  await User.updateMany({}, { $pull: { rooms: memoRoomId } }).exec();
  await MemoRoom.findByIdAndRemove(memoRoomId).exec();

  const targetUser = await User.findById(userId).populate({
    path: "rooms",
    populate: { path: "memos" },
  });

  return formatMemoRoomData(targetUser);
};

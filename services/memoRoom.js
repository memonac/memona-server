const User = require("../models/User");
const Memo = require("../models/Memo");
const MemoRoom = require("../models/MemoRoom");
const Chat = require("../models/Chat");

exports.getAllMemoRoom = async (userId) => {
  const targetUser = await User.findById(userId).populate({
    path: "rooms",
    populate: { path: "memos" },
  });

  //flatMap으로 리팩토링 해보기 ..
  const allTags = [];
  const memoroomInfo = {};

  targetUser.rooms.forEach((room) => {
    const memoTags = room.memos.map((memo) => memo.tags);

    allTags.push(...memoTags);

    memoroomInfo[room._id] = {
      name: room.name,
      tags: Array.from(new Set(memoTags.flat(Infinity))),
    };
  });

  return {
    tags: Array.from(new Set(allTags.flat(Infinity))),
    memoRooms: memoroomInfo,
  };
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

exports.removeMemoRoom = async (memoRoomId) => {
  await Memo.deleteMany({ room: memoRoomId }).exec();
  await Chat.deleteMany({ room: memoRoomId }).exec();
  await User.updateMany({}, { $pull: { rooms: memoRoomId } }).exec();
  await MemoRoom.findByIdAndRemove(memoRoomId).exec();
};

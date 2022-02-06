const User = require("../models/User");
const Memo = require("../models/Memo");
const MemoRoom = require("../models/MemoRoom");
const Chat = require("../models/Chat");

exports.getAllMemoRoom = async (userId) => {
  const memoRooms = await User.findById(userId).populate("rooms");
  const memos = await Memo.find().lean().exec();

  const allTags = memos
    .map((memo) => {
      return memo.tags;
    })
    .flat(Infinity);

  const memoRoomInfo = memoRooms.rooms.map(async (room) => {
    const targetMemoRoom = await MemoRoom.findById(room._id).populate("memos");
    const memoTags = targetMemoRoom.memos.map((memo) => memo.tags);

    const refinedRoom = {};
    refinedRoom[room._id] = {
      name: room.name,
      tags: Array.from(new Set(memoTags)),
    };

    return refinedRoom;
  });

  return {
    tags: Array.from(new Set(allTags)),
    memoRoom: memoRoomInfo,
  };
};

exports.addNewMemoRoom = async (userId, roomName) => {
  const newMemoRoom = await MemoRoom.create({
    owner: userId,
    participants: [userId],
    name: roomName,
  }).exec();;

  await User.findByIdAndUpdate(userId, { $push: { rooms: newMemoRoom._id } }).exec();;
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
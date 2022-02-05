const User = require("../models/User");
const Memo = require("../models/Memo");
const MemoRoom =require("../models/MemoRoom");

exports.getMemoRoom = async (userId) => {
  const memoRooms = await User.findById(userId).populate("rooms");
  const memos = await Memo.find();

  const allTags = memos.map((memo) => {
    return memo.tags;
  }).flat(Infinity);

  const memoRoomInfo = memoRooms.rooms.map((room) => {
    const { _id, name } = room;

    return {
      _id,
      name,
    };
  });

  return {
    tags: Array.from(new Set(allTags)),
    memoRooms: memoRoomInfo,
  };
};

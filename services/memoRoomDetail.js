const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");

exports.getDetailInfo = async (userId, memoroomId) => {
  const user = await User.findById(userId).lean().exec();
  const memoRooms = await MemoRoom.findById(memoroomId)
    .populate("participants")
    .populate("memos");

  const userInfo = {
    id: userId,
    name: user.name,
    email: user.email,
  };
  const participants = {};
  memoRooms.participants.map((participant) => {
    participants[participant._id] = {
      name: participant.name,
      email: participant.email,
    };
  });

  return {
    owner: userInfo,
    participants: participants,
    memos: memoRooms.memos,
    slackToken: memoRooms.slackToken,
    name: memoRooms.name,
  };
};

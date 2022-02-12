const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");
const Chat = require("../models/Chat");

exports.getDetailInfo = async (userId, memoroomId) => {
  const user = await User.findById(userId).lean().exec();
  const memoRooms = await MemoRoom.findById(memoroomId)
    .populate("participants")
    .populate("memos");

  const chat = await Chat.findOne({ room: memoroomId }).lean().exec();

  const chatConversstions = chat ? chat.conversation : [];

  const userInfo = {
    id: userId,
    email: user.email,
    name: user.name,
  };
  const participants = memoRooms.participants.map((participant) => {
    return {
      id: participant._id,
      email: participant.email,
      name: participant.name,
    };
  });

  return {
    owner: userInfo,
    participants: participants,
    memos: memoRooms.memos,
    slackToken: memoRooms.slackToken,
    name: memoRooms.name,
    chats: chatConversstions,
  };
};

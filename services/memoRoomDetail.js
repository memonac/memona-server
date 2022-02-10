const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");
const Memo = require("../models/Memo");

exports.getDetailInfo = async (userId, memoroomId) => {
  const user = await User.findById(userId).lean().exec();
  const memoRooms = await MemoRoom.findById(memoroomId)
    .populate("participants")
    .populate("memos");

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
  };
};

exports.addNewMemo = async ({
  userId,
  memoroomId,
  alarmDateInfo,
  imageFile,
  memoColor,
  memoTags,
  memoType,
}) => {
  const newMemo = await Memo.create({
    room: memoroomId,
    author: userId,
    formType: memoType,
    content: imageFile || "",
    location: [0, 500],
    size: [250, 250],
    color: memoColor,
    alarmDate: alarmDateInfo,
    tags: memoTags.split(" "),
  });

  await MemoRoom.findByIdAndUpdate(memoroomId, {
    $push: { memos: newMemo._id },
  });

  return newMemo;
};

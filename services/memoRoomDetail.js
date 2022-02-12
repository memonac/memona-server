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

  const refinedMemos = {};

  memoRooms.memos.forEach((memo) => {
    refinedMemos[memo._id] = {
      author: memo.author,
      color: memo.color,
      content: memo.content,
      formType: memo.formType,
      location: memo.location,
      room: memo.room,
      size: memo.size,
      tags: memo.tags,
    };
  });

  return {
    owner: userInfo,
    participants: participants,
    memos: refinedMemos,
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
    location: [500, 0],
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

exports.deleteMemo = async ({ memoroomId, memoId }) => {
  await Memo.findByIdAndDelete(memoId);
  await MemoRoom.findByIdAndUpdate(memoroomId, {
    $pull: { memos: memoId },
  });
};

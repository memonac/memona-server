const MemoRoom = require("../models/MemoRoom");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Memo = require("../models/Memo");
const s3 = require("../configs/awsS3");

exports.getDetailInfo = async (userId, memoroomId) => {
  const user = await User.findById(userId).lean().exec();
  const memoRooms = await MemoRoom.findById(memoroomId)
    .populate("participants")
    .populate("memos");

  const chat = await Chat.findOne({ room: memoroomId }).lean().exec();

  const chatConverstions = chat ? chat.conversation.slice(-15) : [];
  let chatLastIndex;

  if (chat) {
    if (chat.conversation.length === chatConverstions.length) {
      chatLastIndex = 0;
    } else {
      chatLastIndex = chat.conversation.length - chatConverstions.length;
    }
  } else {
    chatLastIndex = null;
  }

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
      alarmDate: memo.alarmDate,
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
    chats: chatConverstions,
    chatLastIndex,
  };
};

//음성파일의 경우 메모 작성 후 추후 수정으로 업로드 되기 때문에 해당 로직에서는 작성되지 않음
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
  const targetMemo = await Memo.findById(memoId).lean().exec();

  // aws s3 저장파일 분기처리(단일파일 삭제하는 경우)
  if (targetMemo.formType !== "text") {
    const splitedUrl = targetMemo.content.split("/");

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

  await Memo.findByIdAndDelete(memoId);
  await MemoRoom.findByIdAndUpdate(memoroomId, {
    $pull: { memos: memoId },
  });
};

exports.updateMemoLocation = async ({ memoId, left, top }) => {
  await Memo.findByIdAndUpdate(memoId, { location: [left, top] }).exec();
};

exports.updateMemoSize = async ({ memoId, width, height }) => {
  await Memo.findByIdAndUpdate(memoId, { size: [width, height] }).exec();
};

exports.updateMemoText = async ({ memoId, text }) => {
  await Memo.findByIdAndUpdate(memoId, { content: text }).exec();
};

exports.addAudioFile = async ({ memoId, awsAudioUrl }) => {
  await Memo.findByIdAndUpdate(memoId, { content: awsAudioUrl }).exec();
};

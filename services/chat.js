const Chat = require("../models/Chat");
const MemoRoom = require("../models/MemoRoom");

exports.addChat = async ({ roomId, userId, userName, message, date }) => {
  const chat = await Chat.findOne({ room: roomId }).lean().exec();

  if (!chat) {
    await Chat.create({
      room: roomId,
      conversation: [
        {
          user: {
            id: userId,
            name: userName,
          },
          message,
          sendDate: date,
        },
      ],
    });

    return;
  }

  await Chat.updateOne(
    { room: roomId },
    {
      $push: {
        conversation: {
          user: {
            id: userId,
            name: userName,
          },
          message,
          sendDate: date,
        },
      },
    }
  ).exec();
};

exports.getNextChatList = async (roomId, lastIndex) => {
  const chat = await Chat.findOne({ room: roomId }).lean().exec();

  const startIndex = lastIndex - 15 < 0 ? 0 : lastIndex - 15;
  const endIndex = lastIndex;

  const chatConversation = chat.conversation.slice(startIndex, endIndex);

  return {
    chats: chatConversation,
    lastIndex: startIndex,
  };
};

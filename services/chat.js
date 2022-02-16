const Chat = require("../models/Chat");

exports.addChat = async ({ roomId, userId, userName, message, date }) => {
  const chat = await Chat.findOne({ room: roomId }).lean().exec();

  if (!chat) {
    const chat = await Chat.create({
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

    return chat.conversation[0];
  }

  const chats = await Chat.findOneAndUpdate(
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
    },
    {
      new: true,
    }
  )
    .lean()
    .exec();

  return chats.conversation[chats.conversation.length - 1];
};

exports.getNextChatList = async (roomId, lastIndex) => {
  const targetChat = await Chat.findOne({ room: roomId }).lean().exec();

  const startIndex = lastIndex - 15 < 0 ? 0 : lastIndex - 15;
  const endIndex = lastIndex;

  const chatConversation = targetChat.conversation.slice(startIndex, endIndex);

  return {
    chats: chatConversation,
    lastIndex: startIndex,
  };
};

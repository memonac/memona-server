const Chat = require("../models/Chat");

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

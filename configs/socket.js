const { Server } = require("socket.io");

const chatService = require("../services/chat");
const { SOCKET_EVENT, SOCKET_SPACE } = require("../constants/socket");

module.exports = function createSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT,
    },
  });

  const chatSpace = io.of(SOCKET_SPACE.chat);
  const memoSpace = io.of(SOCKET_SPACE.memo);

  chatSpace.on(SOCKET_EVENT.connection, (socket) => {
    socket.on(SOCKET_EVENT.joinRoom, (userId, userName, roomId) => {
      socket.userId = userId;
      socket.userName = userName;
      socket.roomId = roomId;

      socket.join(roomId);
    });

    socket.on(SOCKET_EVENT.leaveRoom, (roomId) => {
      socket.leave(roomId);
    });

    socket.on(SOCKET_EVENT.sendMessage, async (message, date) => {
      const chat = await chatService.addChat({
        roomId: socket.roomId,
        userId: socket.userId,
        userName: socket.userName,
        message,
        date,
      });

      chatSpace
        .to(socket.roomId)
        .emit(
          SOCKET_EVENT.receiveMessage,
          socket.userId,
          socket.userName,
          message,
          date,
          chat._id.toString()
        );
    });
  });

  memoSpace.on(SOCKET_EVENT.connection, (socket) => {
    socket.on(SOCKET_EVENT.joinRoom, (userId, userName, roomId) => {
      socket.userId = userId;
      socket.userName = userName;
      socket.roomId = roomId;

      socket.join(roomId);
    });

    socket.on(SOCKET_EVENT.leaveRoom, (roomId) => {
      socket.leave(roomId);
    });

    socket.on(SOCKET_EVENT.withdrawRoom, async (userId) => {
      memoSpace.to(socket.roomId).emit(SOCKET_EVENT.withdrawRoom, userId);
    });

    socket.on(
      SOCKET_EVENT.updateParticipants,
      async (participants, memoroomId) => {
        memoSpace
          .to(memoroomId)
          .emit(SOCKET_EVENT.updateParticipants, participants, memoroomId);
      }
    );

    socket.on(SOCKET_EVENT.memoAdd, async (newMemo) => {
      socket.to(socket.roomId).emit(SOCKET_EVENT.memoAdd, newMemo);
    });

    socket.on(SOCKET_EVENT.memoLocation, async (memoId, left, top) => {
      socket
        .to(socket.roomId)
        .emit(SOCKET_EVENT.memoLocation, memoId, left, top);
    });

    socket.on(SOCKET_EVENT.memoDelete, async (memoId) => {
      socket.to(socket.roomId).emit(SOCKET_EVENT.memoDelete, memoId);
    });

    socket.on(SOCKET_EVENT.memoSize, async (memoId, width, height) => {
      socket
        .to(socket.roomId)
        .emit(SOCKET_EVENT.memoSize, memoId, width, height);
    });

    socket.on(SOCKET_EVENT.memoText, async (memoId, text) => {
      socket.to(socket.roomId).emit(SOCKET_EVENT.memoText, memoId, text);
    });

    socket.on(
      SOCKET_EVENT.memoStyle,
      async (memoId, memoColor, alarmDate, tags) => {
        socket
          .to(socket.roomId)
          .emit(SOCKET_EVENT.memoStyle, memoId, memoColor, alarmDate, tags);
      }
    );

    socket.on(SOCKET_EVENT.memoAudio, async (memoId, audioUrl) => {
      socket.to(socket.roomId).emit(SOCKET_EVENT.memoAudio, memoId, audioUrl);
    });
  });
};

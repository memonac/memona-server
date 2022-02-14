const { Server } = require("socket.io");
const chatService = require("../services/chat");
const memoRoomDetailService = require("../services/memoRoomDetail");

module.exports = function createSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT,
    },
  });

  const chatSpace = io.of("/chat");
  const memoSpace = io.of("/memo");

  chatSpace.on("connection", (socket) => {
    socket.on("join room", (userId, userName, roomId) => {
      socket.userId = userId;
      socket.userName = userName;
      socket.roomId = roomId;

      socket.join(roomId);
      socket.to(roomId).emit("join room", userName);
    });

    socket.on("leave room", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("send message", async (message, date) => {
      socket
        .to(socket.roomId)
        .emit("receive message", socket.userId, socket.userName, message, date);
      chatService.addChat({
        roomId: socket.roomId,
        userId: socket.userId,
        userName: socket.userName,
        message,
        date,
      });
    });
  });

  memoSpace.on("connection", (socket) => {
    // 메모 위치 수정하는데 이렇게 필요한가 >?
    socket.on("join room", (userId, userName, roomId) => {
      socket.userId = userId;
      socket.userName = userName;
      socket.roomId = roomId;

      socket.join(roomId);
      socket.to(roomId).emit("join room", userName);
    });

    socket.on("leave room", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("memo/location", async (memoId, left, top) => {
      socket.to(socket.roomId).emit("memo/location", memoId, left, top);
      memoRoomDetailService.updateMemoLocation({
        memoId,
        left,
        top,
      });
    });

    socket.on("memo/delete", async (memoId) => {
      socket.to(socket.roomId).emit("memo/delete", memoId);
      memoRoomDetailService.deleteMemo({
        memoroomId: socket.roomId,
        memoId,
      });
    });

    socket.on("memo/size", async (memoId, width, height) => {
      socket.to(socket.roomId).emit("memo/size", memoId, width, height);
      memoRoomDetailService.updateMemoSize({
        memoId,
        width,
        height,
      });
    });

    socket.on("memo/text", async (memoId, text) => {
      socket.to(socket.roomId).emit("memo/text", memoId, text);
      memoRoomDetailService.updateMemoText({
        memoId,
        text,
      });
    });

    socket.on("memo/style", async (memoId, memoColor, alarmDate, tags) => {
      socket
        .to(socket.roomId)
        .emit("memo/style", memoId, memoColor, alarmDate, tags);
    });
  });
};

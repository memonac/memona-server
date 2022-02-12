const { Server } = require("socket.io");
const chatService = require("../services/chat");

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
};

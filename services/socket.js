const { Server } = require("socket.io");

const socketIo = (server, option) => {
  const io = new Server(server, option);

  io.on("connection", (socket) => {
    // 클라이언트 연결

    socket.on("joinRoom", (userId, roomId) => {
      socket.nickname = userId;
      socket.join(roomId);

      socket.to(roomId).emit(userId);
    });
  });
};

module.exports = {
  socketIo,
};

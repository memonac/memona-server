exports.SOCKET_EVENT = {
  connection: "connection",
  joinRoom: "join room",
  leaveRoom: "leave room",
  sendMessage: "send message",
  receiveMessage: "receive message",
  withdrawRoom: "withdraw room",
  updateParticipants: "update participants",
  memoAdd: "memo/add",
  memoLocation: "memo/location",
  memoDelete: "memo/delete",
  memoSize: "memo/size",
  memoText: "memo/text",
  memoStyle: "memo/style",
  memoAudio: "memo/audio",
};

exports.SOCKET_SPACE = {
  chat: "/chat",
  memo: "/memo",
};

function formatMemoRoomData(userData) {
  const allTags = [];
  const memoroomInfo = {};

  userData.rooms.forEach((room) => {
    const memoTags = room.memos.map((memo) => memo.tags);

    allTags.push(...memoTags);

    const participants = room.participants.map(
      (participant) => participant.name
    );

    memoroomInfo[room._id] = {
      name: room.name,
      owner: room.owner,
      tags: Array.from(new Set(memoTags.flat(Infinity))),
      participants: participants,
    };
  });

  return {
    tags: Array.from(new Set(allTags.flat(Infinity))),
    memoRooms: memoroomInfo,
  };
}

module.exports = formatMemoRoomData;

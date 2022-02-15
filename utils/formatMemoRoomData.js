function formatMemoRoomData(userData) {
  const allTags = [];
  const memoroomInfo = {};

  userData.rooms.forEach((room) => {
    const memoTags = room.memos.map((memo) => memo.tags);

    allTags.push(...memoTags);

    memoroomInfo[room._id] = {
      owner: room.owner,
      name: room.name,
      tags: Array.from(new Set(memoTags.flat(Infinity))),
    };
  });

  return {
    tags: Array.from(new Set(allTags.flat(Infinity))),
    memoRooms: memoroomInfo,
  };
}

module.exports = formatMemoRoomData;

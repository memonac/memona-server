const { expect } = require("chai");
const request = require("supertest");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const MemoRoom = require("../models/MemoRoom");
const Chat = require("../models/Chat");

describe.only("chat test", function () {
  this.timeout(10000);

  let userId;
  let accessToken;
  let refreshToken;
  let memoRoomId;

  describe("01. Get chat list", () => {
    before(async () => {
      const targetUser = await User.create({
        email: "test123123@gmail.com",
        name: "mock user",
      });
      const userName = targetUser.name;

      userId = targetUser._id;
      accessToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);

      const targetMemoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoRoomId = targetMemoRoom._id;

      const date = new Date();

      Chat.create({
        room: memoRoomId,
        conversation: [
          {
            user: {
              id: userId,
              name: userName,
            },
            message: "hi",
            sendDate: date.toISOString(),
          },
        ],
      });
    });

    after(async () => {
      await User.findByIdAndDelete(userId).exec();
      await MemoRoom.findByIdAndDelete(memoRoomId).exec();
      await Chat.deleteMany({ room: memoRoomId }).exec();
    });

    it("01-1 should response with success when get chat list", (done) => {
      request(app)
        .get(`/users/${userId}/memorooms/${memoRoomId}/chats/1`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.data.chats.length).to.eql(1);
          expect(res.body.data.chats[0].message).to.eql("hi");
          expect(res.body.data.lastIndex).to.eql(0);
          done();
        });
    });

    it("01-2 should response with empty chats if a wrong chat index", (done) => {
      request(app)
        .get(`/users/${userId}/memorooms/${memoRoomId}/chats/wrongIndex`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.data.chats.length).to.eql(0);
          expect(res.body.data.lastIndex).to.eql(null);
          done();
        });
    });
  });
});

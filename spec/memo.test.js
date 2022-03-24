const { expect } = require("chai");
const request = require("supertest");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const MemoRoom = require("../models/MemoRoom");
const Memo = require("../models/Memo");

describe.only("Memo test", function () {
  this.timeout(10000);

  const mongoose = require("mongoose");
  const db = mongoose.connection;

  before((done) => {
    (function checkDatabaseConnection() {
      if (db.readyState === 1) {
        return done();
      }

      setTimeout(checkDatabaseConnection, 1000);
    })();
  });

  let userId;
  let accessToken;
  let refreshToken;
  let memoRoomId;
  let memoId;

  describe("01. Add a new memo", () => {
    before(async () => {
      const targetUser = await User.create({
        email: "test123123@gmail.com",
        name: "mock user",
      });

      userId = targetUser._id;
      accessToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);

      const targetMemoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoRoomId = targetMemoRoom._id;
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoRoomId);
      await Memo.deleteMany({ room: memoRoomId });
    });

    it("01-1. should response with success when adding a new memo", (done) => {
      request(app)
        .post(`/users/${userId}/memorooms/${memoRoomId}/memo`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          memoColor: "#ea907a",
          memoTags: "test mock",
          memoType: "text",
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          const newMemoResponse = res.body.data;
          memoId = newMemoResponse._id;

          expect(newMemoResponse).to.exist();
          expect(newMemoResponse.location).to.be([500, 0]);
          expect(newMemoResponse.size).to.be([250, 250]);
          expect(newMemoResponse.tags).to.be(["test", "mock"]);

          const targetMemoroom = await MemoRoom.findById(memoRoomId)
            .lean()
            .exec();
          expect(targetMemoroom.memos).to.include(memoId);
        });

      done();
    });

    it("01-2. should response with error if a wrong formtype is given", (done) => {
      request(app)
        .post(`/users/${userId}/memorooms/${memoRoomId}/memo`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          memoColor: "#ea907a",
          memoTags: "test mock",
          memoType: "false form type",
        })
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.data).to.not.exist;
          expect(res.body.error).to.exist;
          expect(res.body.error.message).to.eql(
            "Memo Type should be text, image or voice"
          );
        });

      done();
    });
  });

  describe("02. Update memo style", () => {
    before(async () => {
      const targetUser = await User.create({
        email: "test123123@gmail.com",
        name: "mock user",
      });

      userId = targetUser._id;
      accessToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);

      const targetMemoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoRoomId = targetMemoRoom._id;

      const targetMemo = await Memo.create({
        room: memoRoomId,
        author: userId,
        formType: "text",
        content: "",
        color: "#ea907a",
        location: [500, 0],
        size: [250, 250],
        tags: ["test", "mock"],
      });
      memoId = targetMemo._id;
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoRoomId);
      await Memo.deleteMany({ room: memoRoomId });
    });

    it("02-1. should response with success when updating memo size", (done) => {
      request(app)
        .put(`/users/${userId}/memorooms/${memoRoomId}/memos/${memoId}/size`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          width: 280,
          height: 450,
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.result).to.eql("success");

          const updatedMemo = await Memo.findById(memoId).lean().exec();
          expect(updatedMemo.size).to.eql([280, 450]);
        });

      done();
    });

    it("02-2. should response with success when updating memo location", (done) => {
      request(app)
        .put(
          `/users/${userId}/memorooms/${memoRoomId}/memos/${memoId}/location`
        )
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          left: 300,
          top: 120,
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.result).to.eql("success");

          const updatedMemo = await Memo.findById(memoId).lean().exec();
          expect(updatedMemo.location).to.eql([300, 120]);
        });

      done();
    });

    it("02-3. should response with success when updating memo text", (done) => {
      request(app)
        .put(`/users/${userId}/memorooms/${memoRoomId}/memos/${memoId}/text`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          text: "This is mock content for test",
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.result).to.eql("success");

          const updatedMemo = await Memo.findById(memoId).lean().exec();
          expect(updatedMemo.content).to.eql("This is mock content for test");
        });

      done();
    });

    it("02-4. should response with success when updating memo style", (done) => {
      request(app)
        .put(`/users/${userId}/memorooms/${memoRoomId}/memos/${memoId}/style`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          memoColor: "#c9e4c5",
          memoTags: "edit update memona",
        })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          const updatedMemoStyle = res.body.data;

          expect(updatedMemoStyle.memoColor).to.eql("#c9e4c5");
          expect(updatedMemoStyle.memoTags.length).to.eql(3);

          const updatedMemo = await Memo.findById(memoId).lean().exec();
          expect(updatedMemo.color).to.eql("#c9e4c5");
          expect(updatedMemo.tags).to.eql(["edit", "update", "memona"]);
        });

      done();
    });

    it("02-5. should response with error if invalid memoId", (done) => {
      request(app)
        .put(
          `/users/${userId}/memorooms/${memoRoomId}/memos/wrongObjectId/style`
        )
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({
          memoColor: "#c9e4c5",
          memoTags: "edit update memona",
        })
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.data).to.not.exist;
          expect(res.body.result).to.eql("fail");
          expect(res.body.error.message).to.eql("Not Valid ObjectId");
        });

      done();
    });
  });

  describe("03. Delete memo", () => {
    before(async () => {
      const targetUser = await User.create({
        email: "test123123@gmail.com",
        name: "mock user",
      });

      userId = targetUser._id;
      accessToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ targetUser }, process.env.SECRET_KEY);

      const targetMemoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoRoomId = targetMemoRoom._id;

      const targetMemo = await Memo.create({
        room: memoRoomId,
        author: userId,
        formType: "text",
        content: "",
        color: "#ea907a",
        location: [500, 0],
        size: [250, 250],
        tags: ["test", "mock"],
      });
      memoId = targetMemo._id;
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoRoomId);
    });

    it("03-1. should response with success when removing a memo", (done) => {
      request(app)
        .delete(`/users/${userId}/memorooms/${memoRoomId}/memos/${memoId}`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.result).to.eql("success");

          const removedMemo = await Memo.findById(memoId).lean().exec();
          expect(removedMemo).to.not.exist;

          const targetMemoroom = await MemoRoom.findById(memoRoomId)
            .lean()
            .exec();
          expect(targetMemoroom.memos).to.not.include(memoId);
        });

      done();
    });

    it("03-2. should response with error if invalid memoId", (done) => {
      request(app)
        .delete(`/users/${userId}/memorooms/${memoRoomId}/memos/wrongObjectId`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.data).to.not.exist;
          expect(res.body.result).to.eql("fail");
          expect(res.body.error.message).to.eql("Not Valid ObjectId");
        });

      done();
    });
  });
});

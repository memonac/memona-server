const { expect } = require("chai");
const request = require("supertest");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const MemoRoom = require("../models/MemoRoom");

describe.only("memoRoom test", function () {
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

  describe("01. Add new memo room", () => {
    let user;
    let userId;
    let accessToken;
    let refreshToken;
    let memoRoomId;

    before(async () => {
      user = await User.create({
        email: "test@gmail.com",
        name: "Leetest",
      });

      userId = user._id;
      accessToken = jwt.sign({ user }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ user }, process.env.SECRET_KEY);
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoRoomId);
    });

    it("01-1. should response with success", async () => {
      const response = await request(app)
        .post(`/users/${userId}/memorooms`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ name: "Test Room name" });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("success");

      const memoRoomId = response.body.data.newMemoRoomId;

      expect(memoRoomId).to.exist;
      expect(mongoose.Types.ObjectId.isValid(memoRoomId)).to.be.true;

      const newMemoRoom = await MemoRoom.findById(memoRoomId);

      expect(newMemoRoom).to.exist;
    });
  });

  describe("02. Update memo room name", () => {
    let user;
    let userId;
    let accessToken;
    let refreshToken;
    let memoRoom;
    let memoRoomId;

    before(async () => {
      user = await User.create({
        email: "test@gameil.com",
        name: "LeeTest",
      });

      userId = user._id;
      accessToken = jwt.sign({ user }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ user }, process.env.SECRET_KEY);

      memoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoRoomId = memoRoom._id;
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoRoomId);
    });

    it("02-1. should response with success", async () => {
      const response = await request(app)
        .put(`/users/${userId}/memorooms/${memoRoomId}`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ name: "Update memo room name" });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("success");

      const updatedMemoRoom = await MemoRoom.findOne({
        name: "Update memo room name",
      });

      expect(updatedMemoRoom).to.exist;
    });

    it("02-2. should response with error if empty is given", async () => {
      const response = await request(app)
        .put(`/users/${userId}/memorooms/${memoRoomId}`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ name: "" });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.exist;
      expect(response.body.error.message).to.equal("Name must be required");
    });
  });

  describe("03. Delete memo room", () => {
    let user;
    let userId;
    let accessToken;
    let refreshToken;
    let memoRoom;
    let memoRoomId;

    before(async () => {
      user = await User.create({
        email: "test@gameil.com",
        name: "LeeTest",
      });

      userId = user._id;
      accessToken = jwt.sign({ user }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ user }, process.env.SECRET_KEY);

      memoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });
      memoRoomId = memoRoom._id;
      console.log(memoRoomId);
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
    });

    it("03-1. should response with success", async () => {
      const response = await request(app)
        .delete(`/users/${userId}/memorooms/${memoRoomId}`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json");

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("success");

      const deletedMemoRoom = await MemoRoom.findById(memoRoomId);

      expect(deletedMemoRoom).to.not.exist;
    });

    it("03-2. should response with error if invalid memoRoomId", async () => {
      const response = await request(app)
        .delete(`/users/${userId}/memorooms/623b2c709a8efasdef7a9aaa`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json");

      expect(response.status).to.equal(400);
      expect(response.body.error).to.exist;
      expect(response.body.result).to.equal("fail");
      expect(response.body.error.message).to.equal("Not Valid ObjectId");
    });
  });
});

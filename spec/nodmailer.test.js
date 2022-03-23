const { expect } = require("chai");
const request = require("supertest");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const MemoRoom = require("../models/MemoRoom");

describe("Nodemailer test", function () {
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

  describe("01.POST users/:userId/memorooms/:memoroomId/invite", () => {
    let user;
    let userId;
    let accessToken;
    let refreshToken;
    let memoRoom;
    let memoroomId;

    before(async () => {
      user = await User.create({
        email: "sender@gmail.com",
        name: "sender",
      });

      userId = user._id;
      accessToken = jwt.sign({ user }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ user }, process.env.SECRET_KEY);

      memoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoroomId = memoRoom._id;
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoroomId);
    });

    it("01-1. should response with success", async () => {
      const response = await request(app)
        .post(`/users/${userId}/memorooms/${memoroomId}/invite`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ email: process.env.INVITEE_EMAIL });

      const result = response.body.result;

      expect(response.status).to.equal(200);
      expect(result).to.equal("success");
    });

    it("01-2. should response with error if invalid email is given", async () => {
      const response = await request(app)
        .post(`/users/${userId}/memorooms/${memoroomId}/invite`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ email: "receiver@gamil.com" });

      const result = response.body.result;

      expect(response.status).to.equal(400);
      expect(result).to.equal("fail");
      expect(response.body.error.message).to.equal("Not Found User");
    });
  });

  describe("02.POST users/:memoroomId/invite", () => {
    let user;
    let userId;
    let accessToken;
    let refreshToken;
    let memoRoom;
    let memoroomId;
    let invitedToken;

    before(async () => {
      user = await User.create({
        email: "sender@gmail.com",
        name: "sender",
      });

      userId = user._id;
      accessToken = jwt.sign({ user }, process.env.SECRET_KEY);
      refreshToken = jwt.sign({ user }, process.env.SECRET_KEY);

      memoRoom = await MemoRoom.create({
        owner: userId,
        participants: [userId],
        name: "Test Room",
      });

      memoroomId = memoRoom._id;
      invitedToken = jwt.sign(
        { email: process.env.INVITEE_EMAIL },
        process.env.SECRET_KEY
      );
    });

    after(async () => {
      await User.findByIdAndDelete(userId);
      await MemoRoom.findByIdAndDelete(memoroomId);
    });

    it("02-1. should response with success if valid email is given", async () => {
      const response = await request(app)
        .post(`/users/${memoroomId}/invite`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ token: invitedToken });

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("success");
      expect(response.body.data).to.exist;

      const invitee = await User.findOne({ email: process.env.INVITEE_EMAIL });

      const inviteeId = invitee._id;
      const participants = response.body.data.participants;
      const isInvitee = Object.keys(participants).includes(
        inviteeId.toString()
      );

      expect(isInvitee).to.be.true;
    });

    it("02-2. should response with error if invalid email is given", async () => {
      const response = await request(app)
        .post(`/users/${memoroomId}/invite`)
        .set("Cookie", [
          `accessToken=${accessToken};refreshToken=${refreshToken}`,
        ])
        .type("application/json")
        .send({ token: "invalidToken" });

      expect(response.body.error).exist;
    });
  });
});

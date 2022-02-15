const express = require("express");
const router = express.Router();
const verifyToken = require("./middlewares/verifyToken");
const verifyFirebaseToken = require("./middlewares/verifyFirebaseToken");

const authController = require("../controllers/auth");

router.get("/login", verifyFirebaseToken, authController.getLogin);
router.get("/logout", authController.getLogout);
router.post("/signup", verifyFirebaseToken, authController.postSignup);

module.exports = router;

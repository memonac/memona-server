const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const verifyFirebaseToken = require("./middlewares/verifyFirebaseToken");

router.get("/login", verifyFirebaseToken, authController.getLogin);
router.get("/logout", authController.getLogout);
router.post("/signup", verifyFirebaseToken, authController.postSignup);

module.exports = router;

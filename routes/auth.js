const express = require("express");
const router = express.Router();
const verifyToken = require("./middlewares/verifyToken");

const authController = require("../controllers/auth");

router.get("/login", verifyToken, authController.getLogin);
router.get("/logout", verifyToken, authController.getLogout);
router.post("/signup", verifyToken, authController.postSignup);

module.exports = router;

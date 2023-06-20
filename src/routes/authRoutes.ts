const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").get(auth, logout);

export = router;

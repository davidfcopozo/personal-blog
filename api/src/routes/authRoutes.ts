import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth";
import {
  register,
  resendVerificationToken,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController";

router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/send-verification-token").post(resendVerificationToken);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").get(auth, logout);

export default router;

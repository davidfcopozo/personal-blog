import { Request, Response, NextFunction } from "express";
const User = require("../models/userModel");
import Crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../utils/attachCookiesToResponse";
import { hashString } from "../utils/hashString";
import { BadRequest, Unauthenticated } from "../errors/index";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail";
import { isValidEmail, isValidUsername } from "../utils/validators";

let baseUrl = "http://localhost:8000";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, username, email, password } = req.body;

  const userExist = await User.findOne({ email });

  //Check if email already exists
  if (userExist) {
    return next(new BadRequest("An account with this email already exists"));
  }

  //Check if this is the first account created
  const isFirstAccount = (await User.countDocuments({})) === 0;

  //If this is the first account, set role to admin, else set role to user
  const role = isFirstAccount ? "admin" : "user";

  //Generate verification token for email verification
  const verificationToken = Crypto.randomBytes(40).toString("hex");

  try {
    const lowercasedUsername = username.toLowerCase();

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    if (!isValidUsername(username)) {
      throw new BadRequest("Invalid username, please provide a valid one");
    }

    const user = await User.create({
      firstName,
      lastName,
      username: lowercasedUsername,
      email,
      password,
      role,
      verificationToken,
    });

    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      baseUrl,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Account registration successful! Please check your email to verify account",
    });
  } catch (error: any) {
    next(new BadRequest(error));
  }
};

const resendVerificationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Unauthenticated("Invalid email address"));
  }

  if (user.verified) {
    return next(new BadRequest("Account is verified already"));
  }

  //Generate verification token for email verification
  const verificationToken = Crypto.randomBytes(40).toString("hex");

  user.verificationToken = verificationToken;

  await user.save();

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    baseUrl,
  });

  res.status(StatusCodes.OK).json({
    message: "Email verification had been resent, please check your email.",
  });
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { token } = req.query;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Unauthenticated("Invalid email address"));
  }

  if (user.verificationToken !== token) {
    return next(new Unauthenticated("Invalid verification token"));
  }

  (user.verificationToken = ""),
    (user.verifiedAt = Date.now()),
    (user.verified = true);

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Unauthenticated("Invalid email address"));
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return next(new Unauthenticated("Invalid password"));
  }

  attachCookiesToResponse({ user, res });
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    return next(new BadRequest("Please provide a valid email address"));
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordResetToken = Crypto.randomBytes(70).toString("hex");

    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      token: passwordResetToken,
      baseUrl,
    });

    const thirtyMinutes = 1000 * 60 * 30;
    const passwordExpirationDate = new Date(Date.now() + thirtyMinutes);

    user.passwordVerificationToken = hashString(passwordResetToken);
    user.passwordExpirationDate = passwordExpirationDate;

    await user.save();
  }

  res.status(StatusCodes.OK).json({
    message:
      "If an account with this email exists, a password reset link has been sent to your email",
    success: true,
  });
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password: newPassword } = req.body;
  const { token } = req.query;

  if (!email || !newPassword || !token) {
    return next(
      new BadRequest("Please provide a valid email address, password and token")
    );
  }

  const user = await User.findOne({ email });

  if (user) {
    if (
      user.passwordVerificationToken !== hashString(token as string) ||
      user.passwordExpirationDate > new Date(Date.now())
    ) {
      return next(new BadRequest("Invalid token"));
    }

    user.password = newPassword;
    user.passwordVerificationToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    res.send("Password reset successful");
  }
};

const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token");

  res
    .status(StatusCodes.OK)
    .json({ message: "Logout successful", success: true });
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  resendVerificationToken,
};

import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import Crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../utils/attachCookiesToResponse";
import { hashString } from "../utils/hashString";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail";
import { isValidEmail, isValidUsername } from "../utils/validators";
import { UserType } from "../typings/types";
import dotenv from "dotenv";
import { generateUniqueUsername } from "../utils/generateUniqueUsername";
dotenv.config();

let baseUrl = "http://localhost:8000";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const userExist: UserType = await User.findOne({ email });
    const usernameExist: UserType = await User.findOne({
      username: username.toLowerCase(),
    });

    //Check if email already exists
    if (userExist) {
      throw new BadRequest("An account with this email already exists");
    }

    //Check if username already exists
    if (usernameExist) {
      throw new BadRequest("An account with this username already exists");
    }

    //Check if this is the first account created
    const isFirstAccount = (await User.countDocuments({})) === 0;

    //If this is the first account, set role to admin, else set role to user
    const role = isFirstAccount ? "admin" : "user";

    //Generate verification token for email verification
    const verificationToken = Crypto.randomBytes(40).toString("hex");
    const lowercasedUsername = username.toLowerCase();

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    if (!isValidUsername(username)) {
      throw new BadRequest("Invalid username, please provide a valid one");
    }

    const user: UserType = await User.create({
      firstName,
      lastName,
      username: lowercasedUsername,
      email,
      password,
      role,
      verificationToken,
    });

    await sendVerificationEmail({
      firstName: user.firstName,
      email: user.email!,
      verificationToken: user.verificationToken!,
      baseUrl,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Account registration successful! Please check your email to verify account",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    const user: UserType = await User.findOne({ email });

    if (!user) {
      throw new NotFound("No user found with this email address");
    }

    if (user.verified) {
      throw new BadRequest("Account is verified already");
    }

    //Generate verification token for email verification
    const verificationToken = Crypto.randomBytes(40).toString("hex");

    user.verificationToken = verificationToken;

    await user.save();

    await sendVerificationEmail({
      firstName: user.firstName,
      email: user.email,
      verificationToken: user.verificationToken,
      baseUrl,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Email verification has been resent, please check your email.",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const { token } = req.query;

    if (!token) {
      throw new BadRequest("Not token provided");
    }

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFound("No user found with this email address");
    }

    if (user.verificationToken !== token) {
      throw new Unauthenticated("Invalid verification token");
    }

    (user.verificationToken = ""),
      (user.verifiedAt = new Date(Date.now())),
      (user.verified = true);

    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new BadRequest("Please provide a valid email address");
    }

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    const user: UserType = await User.findOne({ email });

    if (!user) {
      throw new NotFound("No user found with this email address");
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
      throw new Unauthenticated("Invalid password");
    }

    attachCookiesToResponse({ user, res });
  } catch (err) {
    next(err);
  }
};

export const oAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { provider, email, name, avatar } = req.body;

    if (!email) {
      throw new BadRequest(
        `Please make sure that your ${provider} account has a public email.`
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      const [firstName, lastName] = (name || "").split(" ");
      user = await User.create({
        email,
        firstName,
        lastName,
        username: await generateUniqueUsername(email.split("@")[0]),
        password: Math.random().toString(36).slice(-8),
        provider,
        verified: true, // OAuth users are considered verified
        verifiedAt: new Date(),
        avatar,
      });
    } else if (user.provider !== provider) {
      // If user exists but with a different provider, update the provider
      user.provider = provider;
      await user.save();
    }

    const token = user.getJWT();

    res.status(200).json({
      success: true,
      id: user._id,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    /* console.log("ERROR FROM API", error); */

    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequest("Please provide a valid email address");
    }

    if (!isValidEmail(email)) {
      throw new BadRequest("Invalid email address, please provide a valid one");
    }

    const user: UserType = await User.findOne({ email });

    if (!user) {
      throw new NotFound("No user found with this email address");
    }

    const passwordResetToken = Crypto.randomBytes(70).toString("hex");

    await sendPasswordResetEmail({
      firstName: user.firstName,
      email: user.email,
      token: passwordResetToken,
      baseUrl,
    }).catch((err) => {
      throw new Error(err);
    });

    const thirtyMinutes = 1000 * 60 * 30;
    const passwordTokenExpirationDate = new Date(
      new Date(Date.now() + thirtyMinutes)
    );

    user.passwordVerificationToken = hashString(passwordResetToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;

    await user.save();

    //Send unhashed token in response for testing
    if (process.env.NODE_ENV === "test") {
      res.status(StatusCodes.OK).json({
        success: true,
        token: passwordResetToken,
        msg: "A password reset link has been sent to your email",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "A password reset link has been sent to your email",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password: newPassword } = req.body;
    const { token } = req.query;

    if (!email || !newPassword || !token) {
      throw new BadRequest(
        "Please provide a valid email address, password and token"
      );
    }

    const user: UserType = await User.findOne({ email });

    if (user) {
      if (user.passwordVerificationToken !== hashString(token as string)) {
        throw new Unauthenticated("Invalid token");
      }

      if (
        user.passwordTokenExpirationDate &&
        user.passwordTokenExpirationDate <= new Date(Date.now())
      ) {
        throw new Unauthenticated("Expired token");
      }

      user.password = newPassword;
      user.passwordVerificationToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();

      res.status(StatusCodes.OK).json({
        success: true,
        msg: "Password reset successful",
      });
    }
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  if (req.signedCookies.token) {
    res.clearCookie("token");
  }
  res.status(StatusCodes.OK).json({ success: true, msg: "Logout successful" });
};

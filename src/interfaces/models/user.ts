import { Request } from "express";
import mongoose from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId;
  name: String;
  email: String;
  password: String;
  username: String;
  bio?: String;
  title?: String;
  role: String;
  verificationToken?: String;
  verified?: Boolean;
  verifiedAt?: Date;
  passwordVerificationToken: String;
  passwordExpirationDate: Date;
  favorites: mongoose.Types.ObjectId;
  avatar?: String;
}
export interface RequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}

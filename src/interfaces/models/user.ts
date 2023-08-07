import { Request } from "express";
import mongoose from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId;
  name: String;
  email: String;
  password: String;
  role: String;
  verificationToken?: String;
  verified?: Boolean;
  verifiedAt?: Date;
  passwordVerificationToken: String;
  passwordExpirationDate: Date;
}
export interface IRequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}

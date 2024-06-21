import { Request } from "express";
import mongoose, { Document } from "mongoose";

interface ModelMethods {
  comparePassword: (password: String) => Promise<boolean>;
  getJWT: () => String;
}

export interface UserInterface extends Document, ModelMethods {
  _id: mongoose.Types.ObjectId;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  username: String;
  website?: String;
  bio?: String;
  title?: String;
  role: String;
  verificationToken?: String;
  verified?: Boolean;
  verifiedAt?: Date;
  passwordVerificationToken: String | null;
  passwordTokenExpirationDate: Date | null;
  bookmarks?: mongoose.Types.ObjectId;
  likes?: mongoose.Types.ObjectId;
  avatar?: String;
}
export interface RequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}

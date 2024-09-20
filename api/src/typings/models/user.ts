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
  accessToken: String | null;
  passwordVerificationToken: String | null;
  passwordTokenExpirationDate: Date | null;
  bookmarks?: mongoose.Types.ObjectId[];
  likes?: mongoose.Types.ObjectId[];
  avatar?: String;
  provider: String;
  topicsOfInterest?: String[];
  technologies?: String[];
  socialMediaProfiles?: {
    x?: String;
    linkedIn?: String;
    github?: String;
    facebook?: String;
    instagram?: String;
  };
}

export interface RequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}

import { Request } from "express";
import { Document, ObjectId } from "mongoose";
import { CategoryInterface } from "./category";
import { TopicInterface } from "./topic";

interface ModelMethods {
  comparePassword: (password: String) => Promise<boolean>;
  getJWT: () => String;
}

export interface UserInterface extends Document, ModelMethods {
  _id: ObjectId;
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
  bookmarks?: ObjectId[];
  likes?: ObjectId[];
  avatar?: String;
  provider: String;
  topicsOfInterest?: TopicInterface[];
  technologies?: CategoryInterface[];
  socialMediaProfiles?: {
    x?: String;
    linkedIn?: String;
    github?: String;
    facebook?: String;
    instagram?: String;
    dribble?: String;
  };
  isOnboarded: Boolean;
  following?: ObjectId[];
  followers?: ObjectId[];
}

export interface RequestWithUserInfo extends Request {
  user: {
    userId: String;
  };
}

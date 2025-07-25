import mongoose from "mongoose";
import { CommentInterface } from "../models/comment";
import { PostInterface } from "../models/post";
import { UserInterface } from "../models/user";

export type UserType = UserInterface | null;
export type PostType = PostInterface | null;
export type CommentType = CommentInterface | null;
export type SocialMediaProfiles = {
  x?: string;
  linkedIn?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  dribble?: string;
};

export type PostMongooseType = Omit<PostType, "_id"> & {
  _id: mongoose.Types.ObjectId;
};

export type sendEmailVerifiedConfirmationProps = {
  email: String;
  baseUrl: String;
  locale?: String;
};

import mongoose from "mongoose";

export interface CommentInterface {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  content: String;
  replies?: mongoose.Types.ObjectId[];
  isReply: Boolean;
  // Virtual fields (not stored in DB)
  likesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

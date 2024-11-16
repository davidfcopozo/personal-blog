import mongoose from "mongoose";

export interface CommentInterface {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: String;
  likes?: mongoose.Types.ObjectId[];
  replies?: mongoose.Types.ObjectId[];
  isReply: Boolean;
}

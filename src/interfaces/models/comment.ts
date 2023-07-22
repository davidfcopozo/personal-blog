import mongoose from "mongoose";

export interface IComment {
  postedBy: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: String;
  replies?: mongoose.Types.ObjectId[];
}

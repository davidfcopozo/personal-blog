import mongoose from "mongoose";

export interface Comment {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: String;
  replies?: mongoose.Types.ObjectId[];
}

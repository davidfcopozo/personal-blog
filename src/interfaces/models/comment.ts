import mongoose from "mongoose";

export interface Comment {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: String;
  likes?: mongoose.Types.ObjectId[];
  replies?: mongoose.Types.ObjectId[];
}

import mongoose from "mongoose";

export interface IReply {
  postedBy: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  content: String;
}

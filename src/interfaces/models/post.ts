import mongoose from "mongoose";

export interface IPost {
  title: String;
  content: String;
  postedBy: mongoose.Types.ObjectId;
  image?: String;
  likes?: mongoose.Types.ObjectId[];
  comments?: {
    text: String;
    postedBy: mongoose.Types.ObjectId;
  };
  published: Boolean;
  draft: Boolean;
}

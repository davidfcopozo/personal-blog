import mongoose from "mongoose";

export interface PostInterface {
  _id: mongoose.Types.ObjectId;
  title: String;
  content: String;
  postedBy: mongoose.Types.ObjectId;
  image?: String;
  likes?: mongoose.Types.ObjectId[];
  tags?: String[];
  comments?: {
    text: String;
    postedBy: mongoose.Types.ObjectId;
  };
  published: Boolean;
  draft: Boolean;
}

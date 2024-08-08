import mongoose from "mongoose";

export interface PostInterface {
  _id: mongoose.Types.ObjectId;
  title: String;
  content: String;
  slug: String;
  postedBy: mongoose.Types.ObjectId;
  featuredImage?: String;
  likes?: mongoose.Types.ObjectId[];
  bookmarks?: mongoose.Types.ObjectId[];
  tags?: String[];
  categories?: String[];
  visits?: Number;
  comments?: [
    {
      text: String;
      postedBy: mongoose.Types.ObjectId;
    }
  ];
  published: Boolean;
}

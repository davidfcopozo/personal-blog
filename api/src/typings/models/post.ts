import mongoose from "mongoose";

export interface PostInterface {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  slug: string;
  postedBy: mongoose.Schema.Types.ObjectId;
  featuredImage?: string;
  likes?: mongoose.Schema.Types.ObjectId[];
  bookmarks?: mongoose.Schema.Types.ObjectId[];
  tags?: string[];
  categories?: mongoose.Schema.Types.ObjectId[];
  visits?: number;
  comments?: mongoose.Schema.Types.ObjectId[];
  published: boolean;
}

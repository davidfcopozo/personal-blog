import mongoose from "mongoose";
import { CategoryInterface } from "./category";

export interface PostInterface {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  slug: string;
  postedBy: mongoose.Schema.Types.ObjectId;
  coverImage?: string;
  likes?: mongoose.Schema.Types.ObjectId[];
  bookmarks?: mongoose.Schema.Types.ObjectId[];
  tags?: string[];
  categories?: CategoryInterface[];
  visits?: number;
  comments?: mongoose.Schema.Types.ObjectId[];
  status: "draft" | "published" | "unpublished";
}

import { Types } from "mongoose";

export interface PostInterface {
  _id: Types.ObjectId;
  title: string;
  content: string;
  slug: string;
  postedBy: Types.ObjectId;
  featuredImage?: string;
  likes?: Types.ObjectId[];
  bookmarks?: Types.ObjectId[];
  tags?: string[];
  categories?: Types.ObjectId[];
  visits?: number;
  comments?: Types.ObjectId[];
  published: boolean;
}

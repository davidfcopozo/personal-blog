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
  categories?: Types.ObjectId[]; // Categories should be ObjectIds if they refer to other documents
  visits?: number;
  comments?: Types.ObjectId[]; // Comments should be ObjectIds if they refer to other documents
  published: boolean;
}

import { ObjectId } from "mongoose";
import { CategoryInterface } from "./category";

export interface PostInterface {
  _id: ObjectId;
  title: String;
  content: String;
  slug: String;
  postedBy: ObjectId;
  featuredImage?: String;
  likes?: ObjectId[];
  bookmarks?: ObjectId[];
  tags?: String[];
  categories?: CategoryInterface[];
  visits?: Number;
  comments?: [
    {
      text: String;
      postedBy: ObjectId;
    }
  ];
  published: Boolean;
}

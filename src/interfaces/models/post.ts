import { ObjectId } from "mongoose";

export interface IPost {
  title: String;
  content: String;
  postedBy: ObjectId;
  image?: String;
  likes?: ObjectId[];
  comments?: {
    text: String;
    postedBy: ObjectId;
  };
  published: Boolean;
  draft: Boolean;
}

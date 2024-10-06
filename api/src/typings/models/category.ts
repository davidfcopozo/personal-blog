import { ObjectId } from "mongoose";

export interface CategoryInterface {
  _id: ObjectId;
  name: String;
  postedBy: ObjectId;
  slug: String;
  topic: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  usageCount: Number;
}

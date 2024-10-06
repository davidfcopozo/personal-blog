import { ObjectId } from "mongoose";

export interface TopicInterface {
  _id: ObjectId;
  name: String;
  postedBy: ObjectId;
  description: String;
  createdAt: Date;
  updatedAt: Date;
}

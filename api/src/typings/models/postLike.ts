import { Document, Types } from "mongoose";

export interface PostLikeInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  user: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

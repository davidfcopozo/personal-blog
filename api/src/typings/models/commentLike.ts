import { Document, Types } from "mongoose";

export interface CommentLikeInterface extends Document {
  _id: Types.ObjectId;
  comment: Types.ObjectId;
  user: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

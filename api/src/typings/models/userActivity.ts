import { Document, Types } from "mongoose";

export interface UserActivityInterface extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  action:
    | "view"
    | "like"
    | "unlike"
    | "bookmark"
    | "unbookmark"
    | "comment"
    | "reply"
    | "edit"
    | "delete";
  resourceType: "post" | "comment";
  resourceId: Types.ObjectId;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

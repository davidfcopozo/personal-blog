import { Document, Types } from "mongoose";

export interface PostViewInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  user?: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  source: "direct" | "search" | "social" | "referral" | "email";
  referrer?: string;
  sessionId?: string;
  viewDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

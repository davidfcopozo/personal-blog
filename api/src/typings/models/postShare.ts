import { Document, Types } from "mongoose";

export interface PostShareInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  user?: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  shareType:
    | "native"
    | "facebook"
    | "x"
    | "linkedin"
    | "copy-link"
    | "whatsapp"
    | "email"
    | "other";
  referrer?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

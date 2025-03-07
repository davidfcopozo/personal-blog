import mongoose, { Document } from "mongoose";
export interface ImageInterface extends Document {
  url: string;
  name: string;
  title: string;
  altText: string;
  postedBy: mongoose.Types.ObjectId;
  hash: string;
  tags: string[];
  size: number;
  type: string;
  dimensions: string;
}

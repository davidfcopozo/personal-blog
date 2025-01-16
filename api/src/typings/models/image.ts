import mongoose, { Document } from "mongoose";
export interface ImageInterface extends Document {
  url: string;
  name: string;
  alt: string;
  postedBy: mongoose.Types.ObjectId;
  hash: string;
  tags: string[];
}

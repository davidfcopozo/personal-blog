import mongoose from "mongoose";
import { PostLikeInterface } from "../typings/models/postLike";

const postLikeSchema = new mongoose.Schema<PostLikeInterface>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one like per user per post
postLikeSchema.index({ post: 1, user: 1 }, { unique: true });
postLikeSchema.index({ user: 1, createdAt: -1 });
postLikeSchema.index({ post: 1, createdAt: -1 });

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;

import mongoose from "mongoose";
import { PostBookmarkInterface } from "../typings/models/postBookmark";

const postBookmarkSchema = new mongoose.Schema<PostBookmarkInterface>(
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

// Compound index to ensure one bookmark per user per post
postBookmarkSchema.index({ post: 1, user: 1 }, { unique: true });
postBookmarkSchema.index({ user: 1, createdAt: -1 });
postBookmarkSchema.index({ post: 1, createdAt: -1 });

const PostBookmark = mongoose.model("PostBookmark", postBookmarkSchema);

export default PostBookmark;

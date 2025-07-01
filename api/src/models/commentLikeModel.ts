import mongoose from "mongoose";
import { CommentLikeInterface } from "../typings/models/commentLike";

const commentLikeSchema = new mongoose.Schema<CommentLikeInterface>(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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

// Compound index to ensure one like per user per comment
commentLikeSchema.index({ comment: 1, user: 1 }, { unique: true });
commentLikeSchema.index({ user: 1, createdAt: -1 });
commentLikeSchema.index({ comment: 1, createdAt: -1 });

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);

export default CommentLike;

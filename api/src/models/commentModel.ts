import mongoose from "mongoose";
import { CommentInterface } from "../typings/models/comment";

const commentSchema = new mongoose.Schema<CommentInterface>(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Comment poster is required"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
    },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isReply: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

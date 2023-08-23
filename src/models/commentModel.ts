import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

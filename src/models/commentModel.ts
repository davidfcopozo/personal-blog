import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
    },
    replies: { type: mongoose.Schema.Types.ObjectId, ref: "Reply" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);

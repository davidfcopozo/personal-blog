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
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],

    isReply: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

commentSchema.virtual("likesCount", {
  ref: "CommentLike",
  localField: "_id",
  foreignField: "comment",
  count: true,
  match: { isActive: true },
  justOne: false,
});

commentSchema.methods.populateAnalytics = async function () {
  await this.populate("likesCount");
  return this;
};

// Ensure virtual fields are serialized
commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

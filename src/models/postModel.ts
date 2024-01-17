import mongoose from "mongoose";
import { PostInterface } from "../typings/models/post";

const postSchema = new mongoose.Schema<PostInterface>(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String, public_id: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    visits: { type: Number, default: 0 },
    categories: [{ type: String }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

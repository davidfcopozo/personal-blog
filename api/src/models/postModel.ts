import mongoose from "mongoose";
import { PostInterface } from "../typings/models/post";

const postSchema = new mongoose.Schema<PostInterface>(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
    slug: { type: String, required: [true, "Slug is required"] },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featureImg: {
      type: String,
      public_id: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/personal-blog-e0f8c.appspot.com/o/images%2Ffeature-img.webp?alt=media&token=26e06d3a-7f22-46f4-b339-656c31d37977",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    published: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
    categories: [{ type: String }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

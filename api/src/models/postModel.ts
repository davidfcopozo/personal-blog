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
    featureImage: {
      type: String,
      public_id: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/personal-blog-e0f8c.appspot.com/o/images%2Ffallback-featured-image.webp?alt=media&token=44970380-079b-4d03-80e8-9b322a365e1c",
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

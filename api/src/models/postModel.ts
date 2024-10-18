import mongoose, { model } from "mongoose";
import { PostInterface } from "../typings/models/post";
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postSchema = new Schema<PostInterface>(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
    slug: { type: String, required: [true, "Slug is required"] },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    featuredImage: {
      type: String,
      public_id: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/personal-blog-e0f8c.appspot.com/o/images%2Ffallback-featured-image.webp?alt=media&token=44970380-079b-4d03-80e8-9b322a365e1c",
    },
    likes: [{ type: ObjectId, ref: "User" }],
    bookmarks: [{ type: ObjectId, ref: "User" }],
    tags: [{ type: String }],
    comments: [{ type: ObjectId, ref: "Comment" }],
    published: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
    categories: [{ type: ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;

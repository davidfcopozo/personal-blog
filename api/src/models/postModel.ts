import mongoose, { model } from "mongoose";
import { PostInterface } from "../typings/models/post";
const { Schema } = mongoose;

const postSchema = new Schema<PostInterface>(
  {
    title: { type: String },
    content: { type: String },
    slug: { type: String, required: [true, "Slug is required"] },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featuredImage: {
      type: String,
      public_id: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/personal-blog-e0f8c.appspot.com/o/images%2Ffallback-featured-image.webp?alt=media&token=44970380-079b-4d03-80e8-9b322a365e1c",
      set: (value: string | null | undefined) => {
        if (!value || value.trim() === "") {
          return "https://firebasestorage.googleapis.com/v0/b/personal-blog-e0f8c.appspot.com/o/images%2Ffallback-featured-image.webp?alt=media&token=44970380-079b-4d03-80e8-9b322a365e1c";
        }
        return value;
      },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "draft",
    },
    visits: { type: Number, default: 0 },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

//prefetch categories
postSchema.pre("find", function (next) {
  this.populate("categories");
  next();
});

const Post = model("Post", postSchema);

export default Post;

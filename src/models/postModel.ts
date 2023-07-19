import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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
    comments: [
      {
        text: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

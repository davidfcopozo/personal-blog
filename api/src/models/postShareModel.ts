import mongoose from "mongoose";
import { PostShareInterface } from "../typings/models/postShare";

const postShareSchema = new mongoose.Schema<PostShareInterface>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    ipAddress: {
      type: String,
      maxlength: 45,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    shareType: {
      type: String,
      enum: [
        "native",
        "facebook",
        "twitter",
        "linkedin",
        "copy-link",
        "whatsapp",
        "email",
        "other",
      ],
      default: "other",
      required: true,
    },
    referrer: {
      type: String,
      maxlength: 2000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
postShareSchema.index({ post: 1, createdAt: -1 });
postShareSchema.index({ user: 1, createdAt: -1 });
postShareSchema.index({ post: 1, user: 1, shareType: 1 });
postShareSchema.index({ ipAddress: 1, createdAt: -1 });

const PostShare = mongoose.model("PostShare", postShareSchema);

export default PostShare;

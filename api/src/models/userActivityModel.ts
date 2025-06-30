import mongoose from "mongoose";
import { UserActivityInterface } from "../typings/models/userActivity";

const userActivitySchema = new mongoose.Schema<UserActivityInterface>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "view",
        "like",
        "unlike",
        "bookmark",
        "unbookmark",
        "comment",
        "reply",
        "edit",
        "delete",
      ],
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      // For storing additional data
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
userActivitySchema.index({ user: 1, createdAt: -1 });
userActivitySchema.index({ action: 1, createdAt: -1 });
userActivitySchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
userActivitySchema.index({ createdAt: -1 });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;

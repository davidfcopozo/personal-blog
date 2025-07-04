import mongoose, { model } from "mongoose";
import { NotificationInterface } from "../typings/models/notification";
const { Schema } = mongoose;

const notificationSchema = new Schema<NotificationInterface>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["mention", "comment", "reply", "bookmark", "like", "follow"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    relatedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

// Populate sender information when querying
notificationSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any>, next) {
    this.populate({
      path: "sender",
      select: "firstName lastName username avatar",
    });
    next();
  }
);

const Notification = model("Notification", notificationSchema);

export default Notification;

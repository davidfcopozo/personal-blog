import mongoose, { model } from "mongoose";
import { NotificationPreferencesInterface } from "../typings/models/notification";
const { Schema } = mongoose;

const notificationPreferencesSchema =
  new Schema<NotificationPreferencesInterface>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },
      preferences: {
        mentions: {
          inApp: { type: Boolean, default: true },
          email: { type: Boolean, default: true },
        },
        comments: {
          inApp: { type: Boolean, default: true },
          email: { type: Boolean, default: true },
        },
        replies: {
          inApp: { type: Boolean, default: true },
          email: { type: Boolean, default: true },
        },
        bookmarks: {
          inApp: { type: Boolean, default: true },
          email: { type: Boolean, default: false },
        },
        likes: {
          inApp: { type: Boolean, default: true },
          email: { type: Boolean, default: false },
        },
      },
    },
    { timestamps: true }
  );

const NotificationPreferences = model(
  "NotificationPreferences",
  notificationPreferencesSchema
);

export default NotificationPreferences;

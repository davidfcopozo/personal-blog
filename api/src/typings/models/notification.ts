import { Request } from "express";
import { Document, ObjectId } from "mongoose";

export type NotificationType =
  | "mention"
  | "comment"
  | "reply"
  | "bookmark"
  | "like"
  | "follow";

export interface NotificationInterface extends Document {
  _id: ObjectId;
  recipient: ObjectId;
  sender: ObjectId;
  type: NotificationType;
  message: string;
  relatedPost?: ObjectId;
  relatedComment?: ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferencesInterface extends Document {
  _id: ObjectId;
  userId: ObjectId;
  preferences: {
    mentions: {
      inApp: boolean;
      email: boolean;
    };
    comments: {
      inApp: boolean;
      email: boolean;
    };
    replies: {
      inApp: boolean;
      email: boolean;
    };
    bookmarks: {
      inApp: boolean;
      email: boolean;
    };
    likes: {
      inApp: boolean;
      email: boolean;
    };
    follows: {
      inApp: boolean;
      email: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export interface CreateNotificationData {
  recipientId: ObjectId | string;
  senderId: ObjectId | string;
  type: NotificationType;
  message: string;
  relatedPostId?: ObjectId | string;
  relatedCommentId?: ObjectId | string;
}

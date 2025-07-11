import Notification from "../models/notificationModel";
import NotificationPreferences from "../models/notificationPreferencesModel";
import User from "../models/userModel";
import {
  CreateNotificationData,
  NotificationType,
} from "../typings/models/notification";
import { ObjectId } from "mongoose";
import { emailSender } from "./emailSender";

export class NotificationService {
  private io: any;

  constructor(socketIo?: any) {
    this.io = socketIo;
  }
  async createNotification(data: CreateNotificationData) {
    try {
      // Don't send notification to self
      if (data.recipientId.toString() === data.senderId.toString()) {
        return null;
      }

      let preferences = await NotificationPreferences.findOne({
        userId: data.recipientId,
      });

      if (!preferences) {
        // Create default preferences if they don't exist
        preferences = await NotificationPreferences.create({
          userId: data.recipientId,
          preferences: {
            mentions: { inApp: true, email: true },
            comments: { inApp: true, email: true },
            replies: { inApp: true, email: true },
            bookmarks: { inApp: true, email: false },
            likes: { inApp: true, email: false },
            follows: { inApp: true, email: false },
          },
        });
      }

      // Map NotificationType to preferences key
      type PreferenceKey =
        | "mentions"
        | "comments"
        | "replies"
        | "bookmarks"
        | "likes"
        | "follows";

      const typeKeyMap: Record<NotificationType, PreferenceKey> = {
        mention: "mentions",
        comment: "comments",
        reply: "replies",
        bookmark: "bookmarks",
        like: "likes",
        follow: "follows",
      };

      const typePrefs = preferences.preferences[typeKeyMap[data.type]]; // Create in-app notification if enabled
      let notification = null;
      if (typePrefs.inApp) {
        notification = await Notification.create({
          recipient: data.recipientId,
          sender: data.senderId,
          type: data.type,
          message: data.message,
          relatedPost: data.relatedPostId,
          relatedComment: data.relatedCommentId,
        });

        await notification.populate({
          path: "sender",
          select: "firstName lastName username avatar",
        });

        if (this.io) {
          const notificationData = {
            id: notification._id,
            recipient: notification.recipient,
            type: notification.type,
            message: notification.message,
            sender: notification.sender,
            relatedPost: notification.relatedPost,
            relatedComment: notification.relatedComment,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
          };

          const targetRoom = data.recipientId.toString();

          this.io.to(targetRoom).emit("notification", notificationData);
        }
      }

      if (typePrefs.email) {
        await this.sendEmailNotification(data);
      }

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  private async sendEmailNotification(data: CreateNotificationData) {
    try {
      const [recipient, sender] = await Promise.all([
        User.findById(data.recipientId),
        User.findById(data.senderId),
      ]);

      if (!recipient || !sender) {
        console.error("Recipient or sender not found");
        return;
      }

      const subject = this.getEmailSubject(
        data.type,
        sender.firstName?.toString(),
        sender.lastName?.toString()
      );
      const html = this.getEmailTemplate(data, sender, recipient);

      await emailSender({
        from: process.env.MAIL_USERNAME,
        to: recipient.email ? String(recipient.email) : undefined,
        subject,
        html,
      });
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  private getEmailSubject(
    type: NotificationType,
    senderFirstName: string,
    senderLastName: string
  ): string {
    const senderName = `${senderFirstName} ${senderLastName}`;

    switch (type) {
      case "mention":
        return `${senderName} mentioned you in a comment`;
      case "comment":
        return `${senderName} commented on your post`;
      case "reply":
        return `${senderName} replied to your comment`;
      case "bookmark":
        return `${senderName} bookmarked your post`;
      case "like":
        return `${senderName} liked your post`;
      default:
        return "New notification";
    }
  }

  private getEmailTemplate(
    data: CreateNotificationData,
    sender: any,
    recipient: any
  ): string {
    const senderName = `${sender.firstName} ${sender.lastName}`;
    const appUrl = process.env.CLIENT_URL || "http://localhost:3000";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #fff; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #007cba; color: white; text-decoration: none; border-radius: 5px; }
          .notification-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TechyComm</h1>
          </div>
          <div class="content">
            <h2>Hi ${recipient.firstName},</h2>
            <div class="notification-card">
              <p><strong>${data.message}</strong></p>
              <p>From: <strong>${senderName}</strong> (@${sender.username})</p>
            </div>
            <p>You can view this notification and manage your preferences by visiting your dashboard.</p>
            <a href="${appUrl}/notifications" class="btn">View Notifications</a>
          </div>
          <div class="footer">
            <p>You're receiving this email because you have email notifications enabled for this type of activity.</p>
            <p><a href="${appUrl}/settings/notifications">Manage notification preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async createMentionNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string,
    commentId?: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `@${sender?.username} mentioned you in a comment`;

    return this.createNotification({
      recipientId,
      senderId,
      type: "mention",
      message,
      relatedPostId: postId,
      relatedCommentId: commentId,
    });
  }
  async createCommentNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string,
    commentId: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `${sender?.firstName} ${sender?.lastName} commented on your post`;

    const notification = await this.createNotification({
      recipientId,
      senderId,
      type: "comment",
      message,
      relatedPostId: postId,
      relatedCommentId: commentId,
    });

    return notification;
  }
  async createReplyNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string,
    commentId: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `${sender?.firstName} ${sender?.lastName} replied to your comment`;

    const notification = await this.createNotification({
      recipientId,
      senderId,
      type: "reply",
      message,
      relatedPostId: postId,
      relatedCommentId: commentId,
    });

    return notification;
  }

  async createBookmarkNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `${sender?.firstName} ${sender?.lastName} bookmarked your post`;

    return this.createNotification({
      recipientId,
      senderId,
      type: "bookmark",
      message,
      relatedPostId: postId,
    });
  }

  async createLikeNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `${sender?.firstName} ${sender?.lastName} liked your post`;

    return this.createNotification({
      recipientId,
      senderId,
      type: "like",
      message,
      relatedPostId: postId,
    });
  }

  async createCommentLikeNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string,
    commentId: ObjectId | string
  ) {
    const sender = await User.findById(senderId);
    const message = `${sender?.firstName} ${sender?.lastName} liked your comment`;

    return this.createNotification({
      recipientId,
      senderId,
      type: "like",
      message,
      relatedPostId: postId,
      relatedCommentId: commentId,
    });
  }

  async createFollowNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string
  ) {
    const existingNotification = await Notification.findOne({
      recipient: recipientId,
      sender: senderId,
      type: "follow",
      createdAt: { $gte: new Date(Date.now() - 60000) },
    });

    if (existingNotification) {
      return existingNotification;
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return null;
    }

    const message = `${sender.firstName} ${sender.lastName} started following you`;

    const notification = await this.createNotification({
      recipientId,
      senderId,
      type: "follow",
      message,
    });

    return notification;
  }

  async emitPostUpdate(
    postId: string,
    updateType: "like" | "bookmark" | "comment",
    data: any
  ) {
    if (this.io) {
      this.io.emit("postUpdate", {
        postId,
        updateType,
        data,
        timestamp: new Date(),
      });
    }
  }

  async emitLikeUpdate(postId: string, userId: string, isLiked: boolean) {
    if (this.io) {
      this.io.emit("postLikeUpdate", {
        postId,
        userId,
        isLiked,
        timestamp: new Date(),
      });
    }
  }
  async emitBookmarkUpdate(
    postId: string,
    userId: string,
    isBookmarked: boolean
  ) {
    if (this.io) {
      this.io.emit("postBookmarkUpdate", {
        postId,
        userId,
        isBookmarked,
        timestamp: new Date(),
      });
    }
  }
  async emitCommentUpdate(
    postId: string,
    commentId: string,
    action: "add" | "remove"
  ) {
    if (this.io) {
      this.io.emit("postCommentUpdate", {
        postId,
        commentId,
        action,
        timestamp: new Date(),
      });
    }
  }
  async emitCommentLikeUpdate(
    commentId: string,
    userId: string,
    isLiked: boolean,
    isReply: boolean = false,
    parentCommentId?: string
  ) {
    if (this.io) {
      // Prevent duplicate emissions
      const emissionKey = `${commentId}-${userId}-${isLiked}`;
      if (this.isDuplicateEmission("commentLikeUpdate", emissionKey)) {
        return;
      }

      this.io.emit("commentLikeUpdate", {
        commentId,
        userId,
        isLiked,
        isReply,
        parentCommentId,
        timestamp: new Date(),
      });
    }
  }
  async emitNewComment(postId: string, comment: any, postSlug: string) {
    if (this.io) {
      this.io.emit("newComment", {
        postId,
        postSlug,
        comment,
        timestamp: new Date(),
      });
    }
  }
  async emitNewReply(
    postId: string,
    parentCommentId: string,
    reply: any,
    postSlug: string
  ) {
    if (this.io) {
      this.io.emit("newReply", {
        postId,
        postSlug,
        parentCommentId,
        reply,
        timestamp: new Date(),
      });
    }
  }

  async emitCommentDeleted(
    commentId: string,
    postId: string,
    userId: string,
    allDeletedIds: string[]
  ) {
    if (this.io) {
      this.io.emit("commentDeleted", {
        commentId,
        postId,
        userId,
        // Include all nested reply IDs that were also deleted
        allDeletedIds,
        timestamp: new Date(),
      });
    }
  }
  async emitReplyDeleted(
    replyId: string,
    parentId: string,
    postId: string,
    userId: string,
    allDeletedIds: string[]
  ) {
    if (this.io) {
      this.io.emit("replyDeleted", {
        replyId,
        parentId,
        postId,
        userId,
        allDeletedIds, // Include all nested reply IDs that were also deleted
        timestamp: new Date(),
      });
    } else {
      console.error("❌ Socket.io instance not available for emitReplyDeleted");
    }
  }

  async emitFollowUpdate(
    followedUserId: string,
    followingUserId: string,
    isFollowing: boolean
  ) {
    if (this.io) {
      console.log("🔄 Emitting followUpdate:", {
        followedUserId,
        followingUserId,
        isFollowing,
        timestamp: new Date(),
      });

      this.io.emit("followUpdate", {
        followedUserId,
        followingUserId,
        isFollowing,
        timestamp: new Date(),
      });
    } else {
      console.error("❌ Socket.io instance not available for emitFollowUpdate");
    }
  }

  // Cache to prevent duplicate socket events
  private recentEmissions = new Map<string, number>();

  private isDuplicateEmission(eventType: string, key: string): boolean {
    const fullKey = `${eventType}:${key}`;
    const now = Date.now();
    const lastEmission = this.recentEmissions.get(fullKey);

    if (lastEmission && now - lastEmission < 200) {
      return true;
    }

    this.recentEmissions.set(fullKey, now);

    // Clean up old entries to prevent memory leaks
    if (this.recentEmissions.size > 1000) {
      const cutoff = now - 5000;
      for (const [key, timestamp] of this.recentEmissions.entries()) {
        if (timestamp < cutoff) {
          this.recentEmissions.delete(key);
        }
      }
    }

    return false;
  }
}

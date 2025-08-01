import Notification from "../models/notificationModel";
import NotificationPreferences from "../models/notificationPreferencesModel";
import User from "../models/userModel";
import {
  CreateNotificationData,
  NotificationType,
} from "../typings/models/notification";
import { ObjectId } from "mongoose";
import { emailSender } from "./emailSender";
import notificationEmailTemplateEn from "../templates/notification-email-en";
import notificationEmailTemplateEs from "../templates/notification-email-es";

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
        sender.lastName?.toString(),
        recipient.locale?.toString() || "en"
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
    senderLastName: string,
    locale: string = "en"
  ): string {
    const senderName = `${senderFirstName} ${senderLastName}`;

    const subjects = {
      en: {
        mention: `${senderName} mentioned you in a comment`,
        comment: `${senderName} commented on your post`,
        reply: `${senderName} replied to your comment`,
        bookmark: `${senderName} bookmarked your post`,
        like: `${senderName} liked your post`,
        follow: `${senderName} started following you`,
        default: "New notification",
      },
      es: {
        mention: `${senderName} te mencionó en un comentario`,
        comment: `${senderName} comentó en tu publicación`,
        reply: `${senderName} respondió a tu comentario`,
        bookmark: `${senderName} guardó tu publicación`,
        like: `${senderName} le gustó tu publicación`,
        follow: `${senderName} comenzó a seguirte`,
        default: "Nueva notificación",
      },
    };

    const localizedSubjects =
      subjects[locale as keyof typeof subjects] || subjects.en;
    return (
      localizedSubjects[type as keyof typeof localizedSubjects] ||
      localizedSubjects.default
    );
  }

  private getEmailTemplate(
    data: CreateNotificationData,
    sender: any,
    recipient: any
  ): string {
    const recipientLocale = recipient.locale || "en";
    const appUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const logoSrc =
      "https://lh3.googleusercontent.com/pw/AP1GczP42usITm10yc2j45bzIWFZnuLDmIrVLOr_aGpSqMnQqZiXxGEdAKbOv103csKm-18I8edfCNHjwzv4lXiCDllEns4BD6fJxG-08v1D2NOqGsqZ8L1W3gFqSTE95lxzKeL3RJqK6jlgvYDITEbrjsM=w605-h605-s-no-gm?authuser=0";
    const githubSrc = `${appUrl}/github.svg`;
    const linkedinSrc = `${appUrl}/linkedin.svg`;
    const xSrc = `${appUrl}/x.svg`;

    // Select template based on recipient's locale
    const template =
      recipientLocale === "es"
        ? notificationEmailTemplateEs
        : notificationEmailTemplateEn;

    // Replace template variables
    const currentYear = new Date().getFullYear().toString();

    return template
      .replace(/{{logo_src}}/g, logoSrc)
      .replace(/{{github_src}}/g, githubSrc)
      .replace(/{{linkedin_src}}/g, linkedinSrc)
      .replace(/{{x_src}}/g, xSrc)
      .replace(/{{recipientName}}/g, recipient.firstName || "User")
      .replace(/{{message}}/g, data.message)
      .replace(/{{senderName}}/g, `${sender.firstName} ${sender.lastName}`)
      .replace(/{{senderUsername}}/g, sender.username)
      .replace(/{{appUrl}}/g, appUrl)
      .replace(/{{notificationsUrl}}/g, `${appUrl}/notifications`)
      .replace(/{{settingsUrl}}/g, `${appUrl}/settings/notifications`)
      .replace(/{{year}}/g, currentYear);
  }

  private getLocalizedMessage(
    type: NotificationType | "commentLike",
    senderFirstName: string,
    senderLastName: string,
    senderUsername: string,
    locale: string = "en"
  ): string {
    const senderName = `${senderFirstName} ${senderLastName}`;

    const messages = {
      en: {
        mention: `@${senderUsername} mentioned you in a comment`,
        comment: `${senderName} commented on your post`,
        reply: `${senderName} replied to your comment`,
        bookmark: `${senderName} bookmarked your post`,
        like: `${senderName} liked your post`,
        commentLike: `${senderName} liked your comment`,
        follow: `${senderName} started following you`,
      },
      es: {
        mention: `@${senderUsername} te mencionó en un comentario`,
        comment: `${senderName} comentó en tu publicación`,
        reply: `${senderName} respondió a tu comentario`,
        bookmark: `${senderName} guardó tu publicación`,
        like: `${senderName} le gustó tu publicación`,
        commentLike: `${senderName} le gustó tu comentario`,
        follow: `${senderName} comenzó a seguirte`,
      },
    };

    const localizedMessages =
      messages[locale as keyof typeof messages] || messages.en;
    return (
      localizedMessages[type as keyof typeof localizedMessages] ||
      localizedMessages.comment
    );
  }

  async createMentionNotification(
    recipientId: ObjectId | string,
    senderId: ObjectId | string,
    postId: ObjectId | string,
    commentId?: ObjectId | string
  ) {
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "mention",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "comment",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "reply",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "bookmark",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "like",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const message = this.getLocalizedMessage(
      "commentLike",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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

    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      return null;
    }

    const message = this.getLocalizedMessage(
      "follow",
      sender.firstName?.toString() || "",
      sender.lastName?.toString() || "",
      sender.username?.toString() || "",
      recipient.locale?.toString() || "en"
    );

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

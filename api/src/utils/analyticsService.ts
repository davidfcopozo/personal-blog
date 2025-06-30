import PostView from "../models/postViewModel";
import PostLike from "../models/postLikeModel";
import PostBookmark from "../models/postBookmarkModel";
import CommentLike from "../models/commentLikeModel";
import UserActivity from "../models/userActivityModel";
import { Types } from "mongoose";

// Rate limiting configuration
const RATE_LIMITS = {
  POST_VIEW_COOLDOWN: 5 * 60 * 1000, // 5 minutes
  USER_ACTION_COOLDOWN: 1000, // 1 second
  MAX_VIEWS_PER_IP_PER_HOUR: 100,
};

export class AnalyticsService {
  // Helper method to check if view should be recorded (prevent spam)
  static async shouldRecordView(
    postId: string,
    userId?: string,
    ipAddress?: string
  ): Promise<boolean> {
    try {
      const now = new Date();
      const cooldownTime = new Date(
        now.getTime() - RATE_LIMITS.POST_VIEW_COOLDOWN
      );

      // Check for recent view by the same user or IP
      const recentViewQuery: any = {
        post: postId,
        createdAt: { $gte: cooldownTime },
      };

      if (userId) {
        recentViewQuery.user = userId;
      } else if (ipAddress) {
        recentViewQuery.ipAddress = ipAddress;
        // Only check anonymous views for IP
        recentViewQuery.user = { $exists: false };
      } else {
        return false;
      }

      const recentView = await PostView.findOne(recentViewQuery);

      if (recentView) {
        return false;
      }

      // Additional IP rate limiting for anonymous users
      if (!userId && ipAddress) {
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const recentViewsCount = await PostView.countDocuments({
          ipAddress,
          user: { $exists: false },
          createdAt: { $gte: hourAgo },
        });

        if (recentViewsCount >= RATE_LIMITS.MAX_VIEWS_PER_IP_PER_HOUR) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking view recording eligibility:", error);
      return true;
    }
  }

  // Post Views
  static async recordPostView(data: {
    postId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    source?: string;
    referrer?: string;
    sessionId?: string;
    viewDuration?: number;
  }) {
    try {
      if (!data.postId || !Types.ObjectId.isValid(data.postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (data.userId && !Types.ObjectId.isValid(data.userId)) {
        throw new Error("Invalid user ID provided");
      }

      // Sanitize viewDuration - Max 24 hours
      const viewDuration = Math.max(0, Math.min(data.viewDuration || 0, 86400));

      // Limit string lengths to prevent potential abuse
      const ipAddress = data.ipAddress?.substring(0, 45);
      const userAgent = data.userAgent?.substring(0, 500);
      const referrer = data.referrer?.substring(0, 2048);
      const sessionId = data.sessionId?.substring(0, 128);

      const validSources = ["direct", "search", "social", "referral", "email"];
      const source = validSources.includes(data.source || "")
        ? data.source
        : "direct";

      const canRecordView = await this.shouldRecordView(
        data.postId,
        data.userId,
        ipAddress
      );

      if (!canRecordView) {
        return null;
      }

      const postView = new PostView({
        post: data.postId,
        user: data.userId ? new Types.ObjectId(data.userId) : undefined,
        ipAddress,
        userAgent,
        source,
        referrer,
        sessionId,
        viewDuration,
      });

      await postView.save();

      if (data.userId) {
        await this.recordUserActivity({
          userId: data.userId,
          action: "view",
          resourceType: "post",
          resourceId: data.postId,
          metadata: {
            source,
            viewDuration,
          },
          ipAddress,
          userAgent,
        });
      }

      return postView;
    } catch (error) {
      console.error("Error recording post view:", error);
      throw error;
    }
  }

  // Post Likes
  static async togglePostLike(
    postId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      if (!postId || !Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID provided");
      }

      const sanitizedIpAddress = ipAddress?.substring(0, 45);
      const sanitizedUserAgent = userAgent?.substring(0, 500);

      const existingLike = await PostLike.findOne({
        post: postId,
        user: userId,
      });

      let action: "like" | "unlike";

      if (existingLike) {
        existingLike.isActive = !existingLike.isActive;
        await existingLike.save();
        action = existingLike.isActive ? "like" : "unlike";
      } else {
        await PostLike.create({
          post: postId,
          user: userId,
          isActive: true,
        });
        action = "like";
      }

      await this.recordUserActivity({
        userId,
        action,
        resourceType: "post",
        resourceId: postId,
        ipAddress: sanitizedIpAddress,
        userAgent: sanitizedUserAgent,
      });

      return { action, liked: action === "like" };
    } catch (error) {
      console.error("Error toggling post like:", error);
      throw error;
    }
  }

  // Post Bookmarks
  static async togglePostBookmark(
    postId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      if (!postId || !Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID provided");
      }

      const sanitizedIpAddress = ipAddress?.substring(0, 45);
      const sanitizedUserAgent = userAgent?.substring(0, 500);

      const existingBookmark = await PostBookmark.findOne({
        post: postId,
        user: userId,
      });

      let action: "bookmark" | "unbookmark";

      if (existingBookmark) {
        existingBookmark.isActive = !existingBookmark.isActive;
        await existingBookmark.save();
        action = existingBookmark.isActive ? "bookmark" : "unbookmark";
      } else {
        await PostBookmark.create({
          post: postId,
          user: userId,
          isActive: true,
        });
        action = "bookmark";
      }

      await this.recordUserActivity({
        userId,
        action,
        resourceType: "post",
        resourceId: postId,
        ipAddress: sanitizedIpAddress,
        userAgent: sanitizedUserAgent,
      });

      return { action, bookmarked: action === "bookmark" };
    } catch (error) {
      console.error("Error toggling post bookmark:", error);
      throw error;
    }
  }

  // Comment Likes
  static async toggleCommentLike(
    commentId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      if (!commentId || !Types.ObjectId.isValid(commentId)) {
        throw new Error("Invalid comment ID provided");
      }

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID provided");
      }

      const sanitizedIpAddress = ipAddress?.substring(0, 45);
      const sanitizedUserAgent = userAgent?.substring(0, 500);

      const existingLike = await CommentLike.findOne({
        comment: commentId,
        user: userId,
      });

      let action: "like" | "unlike";

      if (existingLike) {
        existingLike.isActive = !existingLike.isActive;
        await existingLike.save();
        action = existingLike.isActive ? "like" : "unlike";
      } else {
        await CommentLike.create({
          comment: commentId,
          user: userId,
          isActive: true,
        });
        action = "like";
      }

      await this.recordUserActivity({
        userId,
        action,
        resourceType: "comment",
        resourceId: commentId,
        ipAddress: sanitizedIpAddress,
        userAgent: sanitizedUserAgent,
      });

      return { action, liked: action === "like" };
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  }

  static async recordUserActivity(data: {
    userId: string;
    action:
      | "view"
      | "like"
      | "unlike"
      | "bookmark"
      | "unbookmark"
      | "comment"
      | "reply"
      | "edit"
      | "delete";
    resourceType: "post" | "comment";
    resourceId: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const activity = new UserActivity({
        user: data.userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });

      await activity.save();
      return activity;
    } catch (error) {
      console.error("Error recording user activity:", error);
      throw error;
    }
  }

  // Analytics Queries
  static async getPostAnalytics(
    postId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      if (!postId || !Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (startDate && endDate && startDate > endDate) {
        throw new Error("Start date cannot be after end date");
      }

      // Limit date range to prevent excessive queries (max 1 year)
      if (startDate && endDate) {
        // 1 year in milliseconds
        const maxRange = 365 * 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() > maxRange) {
          throw new Error("Date range cannot exceed 1 year");
        }
      }

      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;

      const [views, likes, bookmarks] = await Promise.all([
        PostView.countDocuments({
          post: postId,
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        }),

        PostLike.countDocuments({
          post: postId,
          isActive: true,
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        }),

        PostBookmark.countDocuments({
          post: postId,
          isActive: true,
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        }),
      ]);

      return { views, likes, bookmarks };
    } catch (error) {
      console.error("Error getting post analytics:", error);
      throw error;
    }
  }

  static async getCommentAnalytics(
    commentId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;

      const likes = await CommentLike.countDocuments({
        comment: commentId,
        isActive: true,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      });

      return { likes };
    } catch (error) {
      console.error("Error getting comment analytics:", error);
      throw error;
    }
  }

  static async getUserAnalytics(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;

      const activities = await UserActivity.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
            ...(Object.keys(dateFilter).length > 0 && {
              createdAt: dateFilter,
            }),
          },
        },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
      ]);

      const activityMap = activities.reduce((acc, activity) => {
        acc[activity._id] = activity.count;
        return acc;
      }, {});

      return activityMap;
    } catch (error) {
      console.error("Error getting user analytics:", error);
      throw error;
    }
  }

  // Check if user has liked/bookmarked
  static async getUserPostInteractions(postId: string, userId: string) {
    try {
      if (!postId || !Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID provided");
      }

      const [like, bookmark] = await Promise.all([
        PostLike.findOne({ post: postId, user: userId, isActive: true }),
        PostBookmark.findOne({ post: postId, user: userId, isActive: true }),
      ]);

      return {
        liked: !!like,
        bookmarked: !!bookmark,
      };
    } catch (error) {
      console.error("Error getting user post interactions:", error);
      throw error;
    }
  }

  static async getUserCommentInteractions(commentId: string, userId: string) {
    try {
      if (!commentId || !Types.ObjectId.isValid(commentId)) {
        throw new Error("Invalid comment ID provided");
      }

      if (!userId || !Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID provided");
      }

      const like = await CommentLike.findOne({
        comment: commentId,
        user: userId,
        isActive: true,
      });

      return {
        liked: !!like,
      };
    } catch (error) {
      console.error("Error getting user comment interactions:", error);
      throw error;
    }
  }

  // Data maintenance methods
  static async cleanupOldViews(daysOld: number = 365) {
    try {
      if (daysOld < 30) {
        throw new Error("Cannot cleanup views newer than 30 days");
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await PostView.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error cleaning up old views:", error);
      throw error;
    }
  }

  static async cleanupOldUserActivity(daysOld: number = 365) {
    try {
      if (daysOld < 30) {
        throw new Error("Cannot cleanup activity newer than 30 days");
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await UserActivity.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error cleaning up old user activity:", error);
      throw error;
    }
  }

  // Aggregation methods for more speific analytics
  static async getTopPostsByViews(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      if (limit > 100) {
        throw new Error("Limit cannot exceed 100");
      }

      const matchStage: any = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = startDate;
        if (endDate) matchStage.createdAt.$lte = endDate;
      }

      const pipeline = [];

      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      pipeline.push(
        {
          $group: {
            _id: "$post",
            viewCount: { $sum: 1 },
            uniqueUsers: { $addToSet: "$user" },
            uniqueIPs: { $addToSet: "$ipAddress" },
          },
        },
        {
          $addFields: {
            uniqueUserCount: { $size: "$uniqueUsers" },
            uniqueIPCount: { $size: "$uniqueIPs" },
          },
        },
        {
          $sort: { viewCount: -1 as const },
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "_id",
            as: "post",
          },
        },
        {
          $unwind: "$post",
        }
      );

      const results = await PostView.aggregate(pipeline);
      return results;
    } catch (error) {
      console.error("Error getting top posts by views:", error);
      throw error;
    }
  }

  static async getDailyAnalytics(postId: string, days: number = 30) {
    try {
      if (!postId || !Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID provided");
      }

      if (days > 365 || days < 1) {
        throw new Error("Days must be between 1 and 365");
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const pipeline = [
        {
          $match: {
            post: new Types.ObjectId(postId),
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            views: { $sum: 1 },
            uniqueUsers: { $addToSet: "$user" },
            sources: { $push: "$source" },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            uniqueUserCount: { $size: "$uniqueUsers" },
          },
        },
        {
          $sort: { date: 1 as const },
        },
      ];

      const dailyViews = await PostView.aggregate(pipeline);

      // Get daily likes and bookmarks
      const [dailyLikes, dailyBookmarks] = await Promise.all([
        PostLike.aggregate([
          {
            $match: {
              post: new Types.ObjectId(postId),
              isActive: true,
              createdAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              likes: { $sum: 1 },
            },
          },
          {
            $addFields: {
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
        ]),

        PostBookmark.aggregate([
          {
            $match: {
              post: new Types.ObjectId(postId),
              isActive: true,
              createdAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              bookmarks: { $sum: 1 },
            },
          },
          {
            $addFields: {
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
        ]),
      ]);

      return {
        views: dailyViews,
        likes: dailyLikes,
        bookmarks: dailyBookmarks,
      };
    } catch (error) {
      console.error("Error getting daily analytics:", error);
      throw error;
    }
  }
}

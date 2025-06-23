import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import Notification from "../models/notificationModel";
import NotificationPreferences from "../models/notificationPreferencesModel";
import { NotFound, BadRequest } from "../errors";
import { AuthenticatedRequest } from "../typings/models/notification";

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user!.userId;

    const query: any = { recipient: userId };
    if (unreadOnly === "true") {
      query.isRead = false;
    }
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate({
        path: "relatedPost",
        select: "title slug postedBy",
        populate: {
          path: "postedBy",
          select: "username",
        },
      })
      .populate({
        path: "relatedComment",
        select: "content",
      });

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalNotifications / Number(limit)),
        total: totalNotifications,
        limit: Number(limit),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching notifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user!.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new NotFound("Notification not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error marking notification as read",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user!.userId;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new NotFound("Notification not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error deleting notification",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getNotificationPreferences = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    let preferences = await NotificationPreferences.findOne({ userId });

    if (!preferences) {
      // Create default preferences if they don't exist
      preferences = await NotificationPreferences.create({
        userId,
        preferences: {
          mentions: { inApp: true, email: true },
          comments: { inApp: true, email: true },
          replies: { inApp: true, email: true },
          bookmarks: { inApp: true, email: false },
          likes: { inApp: true, email: false },
        },
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      preferences,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching notification preferences",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateNotificationPreferences = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const { preferences } = req.body;

    if (!preferences) {
      throw new BadRequest("Preferences are required");
    }

    const updatedPreferences = await NotificationPreferences.findOneAndUpdate(
      { userId },
      { preferences },
      { new: true, upsert: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      preferences: updatedPreferences,
      message: "Notification preferences updated successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating notification preferences",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

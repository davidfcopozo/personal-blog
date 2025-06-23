"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/components/ui/use-toast";
import { Notification } from "@/typings/interfaces";

export const useNotifications = () => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return "🏷️";
      case "comment":
        return "💬";
      case "reply":
        return "↩️";
      case "bookmark":
        return "🔖";
      case "like":
        return "❤️";
      default:
        return "🔔";
    }
  };
  useEffect(() => {
    if (!socket) {
      console.log("❌ No socket available for notification listener");
      return;
    }

    console.log(
      "🔌 Socket available, setting up notification listener. Socket ID:",
      socket.id
    );
    const handleNotification = (notification: Notification) => {
      console.log("📱 Received notification via Socket.IO:", notification);

      setNotifications((prev) => {
        console.log(
          "📝 Adding notification to list, previous count:",
          prev.length
        );

        // Check if notification already exists to prevent duplicates        // Deduplicate notifications based on id or _id
        const exists = prev.some(
          (n) => (n.id || n._id) === (notification.id || notification._id)
        );
        if (exists) {
          console.log(
            "📝 Notification already exists, skipping:",
            notification.id || notification._id
          );
          return prev;
        }

        const newList = [notification, ...prev];
        console.log("📝 New notifications list count:", newList.length);
        return newList;
      });

      setUnreadCount((prev) => {
        console.log("📊 Updating unread count from", prev, "to", prev + 1);
        return prev + 1;
      });
      toast({
        title: `${getNotificationIcon(notification.type)} New Notification`,
        description: notification.message,
        duration: 5000,
      });
    };

    const handleNotificationRead = (data: { notificationId: string }) => {
      console.log(
        "📖 Notification marked as read via socket:",
        data.notificationId
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          (notification.id || notification._id) === data.notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleNotificationDeleted = (data: { notificationId: string }) => {
      console.log("🗑️ Notification deleted via socket:", data.notificationId);
      setNotifications((prev) => {
        const notification = prev.find(
          (n) => (n.id || n._id) === data.notificationId
        );
        const newList = prev.filter(
          (n) => (n.id || n._id) !== data.notificationId
        );

        // Update unread count if deleted notification was unread
        if (notification && !notification.isRead) {
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        }

        return newList;
      });
    };

    const handleAllNotificationsRead = () => {
      console.log("📖 All notifications marked as read via socket");
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    };

    console.log("🔌 Setting up notification listeners on socket");
    socket.on("notification", handleNotification);
    socket.on("notificationRead", handleNotificationRead);
    socket.on("notificationDeleted", handleNotificationDeleted);
    socket.on("allNotificationsRead", handleAllNotificationsRead);

    return () => {
      console.log("🔌 Cleaning up notification listeners");
      socket.off("notification", handleNotification);
      socket.off("notificationRead", handleNotificationRead);
      socket.off("notificationDeleted", handleNotificationDeleted);
      socket.off("allNotificationsRead", handleAllNotificationsRead);
    };
  }, [socket, toast]);
  const fetchNotifications = useCallback(
    async (page = 1, limit = 20, unreadOnly = false) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        if (page === 1) {
          // Deduplicate notifications based on id or _id
          const uniqueNotifications = data.notifications.filter(
            (notification: Notification, index: number, self: Notification[]) =>
              index ===
              self.findIndex(
                (n) => (n.id || n._id) === (notification.id || notification._id)
              )
          );
          setNotifications(uniqueNotifications);
        } else {
          setNotifications((prev) => {
            const combined = [...prev, ...data.notifications];
            // Deduplicate the combined list based on id or _id
            const uniqueNotifications = combined.filter(
              (notification, index, self) =>
                index ===
                self.findIndex(
                  (n) =>
                    (n.id || n._id) === (notification.id || notification._id)
                )
            );
            return uniqueNotifications;
          });
        }
        setUnreadCount(data.unreadCount);
        return data;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch notifications",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      console.log("📖 markAsRead called with ID:", notificationId);
      try {
        setNotifications((prev) =>
          prev.map((notification) =>
            (notification.id || notification._id) === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        const response = await fetch(
          `/api/notifications/${notificationId}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
          setNotifications((prev) =>
            prev.map((notification) =>
              (notification.id || notification._id) === notificationId
                ? { ...notification, isRead: false }
                : notification
            )
          );
          setUnreadCount((prev) => prev + 1);
          return;
        }

        console.log("📖 Notification marked as read on server");
        console.log("📡 Emitting markNotificationAsRead socket event");
        if (socket) {
          socket.emit("markNotificationAsRead", { notificationId });
          console.log("📡 Socket event emitted successfully");
        } else {
          console.warn("❌ No socket available to emit event");
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Revert the optimistic update on error
        setNotifications((prev) =>
          prev.map((notification) =>
            (notification.id || notification._id) === notificationId
              ? { ...notification, isRead: false }
              : notification
          )
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    [socket]
  );

  const markAllAsRead = useCallback(async () => {
    // Store current state for potential rollback
    const originalNotifications = notifications;
    const originalUnreadCount = unreadCount;

    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);

      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Emit socket event to sync with other components
      if (socket) {
        socket.emit("markAllNotificationsAsRead");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read",
      });
    }
  }, [socket, toast, notifications, unreadCount]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      // Find the notification before deleting to check if it was unread
      const deletedNotification = notifications.find(
        (n) => (n.id || n._id) === notificationId
      );

      try {
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              (notification.id || notification._id) !== notificationId
          )
        );

        // Decrease unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }

        // Emit socket event to sync with other components
        if (socket) {
          socket.emit("deleteNotification", { notificationId });
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
        // Revert the optimistic update on error
        if (deletedNotification) {
          setNotifications((prev) => [deletedNotification, ...prev]);
          if (!deletedNotification.isRead) {
            setUnreadCount((prev) => prev + 1);
          }
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete notification",
        });
      }
    },
    [notifications, socket, toast]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

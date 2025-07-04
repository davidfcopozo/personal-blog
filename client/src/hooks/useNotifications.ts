"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/components/ui/use-toast";
import { Notification } from "@/typings/interfaces";

export const useNotifications = () => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs to avoid dependency issues in useEffect
  const recentNotificationsRef = useRef(new Set<string>());
  const toastShownRef = useRef(new Set<string>());

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
      case "follow":
        return "🤝";
      default:
        return "🔔";
    }
  };
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNotification = (notification: Notification) => {
      const notificationId = notification.id || notification._id;
      const senderId =
        (notification.sender as any)?._id || notification.sender.username;
      const recipientId = (notification as any).recipient || "";
      const dedupeKey = `${notification.type}-${senderId}-${notification.message}-${recipientId}`;

      // Check for recent duplicates (within last 10 seconds)
      if (recentNotificationsRef.current.has(dedupeKey)) {
        return;
      }

      recentNotificationsRef.current.add(dedupeKey);

      // Clean up old entries after 10 seconds
      setTimeout(() => {
        recentNotificationsRef.current.delete(dedupeKey);
      }, 10000);

      // Add notification to state regardless of type
      setNotifications((prev) => {
        const notificationId = notification.id || notification._id;
        const existsById = prev.some((n) => (n.id || n._id) === notificationId);

        // Also check by content to catch duplicate notifications with different IDs
        const existsByContent = prev.some((n) => {
          const nSenderId = (n.sender as any)?._id || n.sender.username;
          const nKey = `${n.type}-${nSenderId}-${n.message}`;
          return nKey === dedupeKey.split("-").slice(0, 3).join("-");
        });

        if (existsById || existsByContent) {
          return prev;
        }

        const newList = [notification, ...prev];
        return newList;
      });

      setUnreadCount((prev) => prev + 1);

      if (toastShownRef.current.has(dedupeKey)) {
        return;
      }

      toastShownRef.current.add(dedupeKey);

      setTimeout(() => {
        toastShownRef.current.delete(dedupeKey);
      }, 10000);

      toast({
        title: `${getNotificationIcon(notification.type)} New Notification`,
        description: notification.message,
        duration: 5000,
      });
    };

    const handleNotificationRead = (data: { notificationId: string }) => {
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
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    };

    socket.on("notification", handleNotification);
    socket.on("notificationRead", handleNotificationRead);
    socket.on("notificationDeleted", handleNotificationDeleted);
    socket.on("allNotificationsRead", handleAllNotificationsRead);

    return () => {
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
      try {
        // Update local state immediately for responsiveness (optimistic update)
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
        }

        // Emit socket event to sync with other components
        if (socket) {
          socket.emit("markNotificationAsRead", { notificationId });
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

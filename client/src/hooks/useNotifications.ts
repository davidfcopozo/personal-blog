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

    console.log("🔌 Setting up notification listener on socket");
    socket.on("notification", handleNotification);

    return () => {
      console.log("🔌 Cleaning up notification listener");
      socket.off("notification", handleNotification);
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

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
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
      setNotifications((prev) =>
        prev.map((notification) =>
          (notification.id || notification._id) === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read",
      });
    }
  }, [toast]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              (notification.id || notification._id) !== notificationId
          )
        );

        // Decrease unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete notification",
        });
      }
    },
    [notifications, toast]
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

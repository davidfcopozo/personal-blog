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
        const newList = [notification, ...prev];
        console.log("📝 New notifications list count:", newList.length);
        return newList;
      });
      setUnreadCount((prev) => {
        console.log("📊 Updating unread count from", prev, "to", prev + 1);
        return prev + 1;
      });

      toast({
        title: "New Notification",
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

        console.log("📊 Fetched notifications data:", data);
        console.log("📊 Current unread count before update:", unreadCount);

        if (page === 1) {
          console.log(
            "📝 Setting notifications (page 1):",
            data.notifications.length,
            "items"
          );
          setNotifications(data.notifications);
        } else {
          console.log(
            "📝 Adding notifications (page",
            page,
            "):",
            data.notifications.length,
            "items"
          );
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        console.log("📊 Setting unread count to:", data.unreadCount);
        setUnreadCount(data.unreadCount);
        return data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch notifications",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, unreadCount]
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
          notification.id === notificationId
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
          prev.filter((notification) => notification.id !== notificationId)
        );

        // Decrease unread count if the deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
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

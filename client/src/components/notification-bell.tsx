"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";
import { useSocket } from "@/context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Notification } from "@/typings/interfaces";

const NotificationBell: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchNotifications(1, 10);
      hasFetchedRef.current = true;
    }
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpen && hasFetchedRef.current) {
      if (notifications.length === 0) {
        fetchNotifications(1, 10);
      }
    }
  }, [isOpen, fetchNotifications, notifications.length]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id || notification._id!);
    }
  };

  const handleNotificationNavigate = (notification: Notification) => {
    setIsOpen(false);
  };

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

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedPost) {
      // Handle case where relatedPost might be an object with slug or _id
      if (typeof notification.relatedPost === "string") {
        // If it's just a string ID, fallback to notifications page
        return "/notifications";
      } else if (
        typeof notification.relatedPost === "object" &&
        notification.relatedPost.slug &&
        notification.relatedPost.postedBy?.username
      ) {
        return `/${notification.relatedPost.postedBy.username}/${notification.relatedPost.slug}`;
      } else if (
        typeof notification.relatedPost === "object" &&
        notification.relatedPost._id
      ) {
        // Fallback if we don't have username/slug but have _id
        return "/notifications";
      }
    }
    // Fallback to notifications page
    return "/notifications";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent className="w-80 h-96 p-0 flex flex-col" align="end">
        <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Link href="/settings/notifications">
              <Button variant="ghost" size="sm">
                <Settings className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="flex-1 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(156 163 175) rgb(243 244 246)",
          }}
        >
          {isLoading ? (
            <div className="p-2 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="py-1">
              {" "}
              {notifications.map((notification, index) => {
                // Handle both _id and id properties
                const notificationId = notification.id || notification._id;

                if (!notification || !notificationId) {
                  return null;
                }

                return (
                  <div
                    key={notificationId}
                    className={`relative group hover:bg-muted/50 transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : ""
                    }`}
                  >
                    <div className="p-3 flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={getNotificationLink(notification)}
                          onClick={() =>
                            handleNotificationNavigate(notification)
                          }
                          className="block"
                        >
                          <p className="text-sm font-medium text-foreground hover:text-primary">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </Link>
                      </div>
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        {" "}
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleNotificationClick({
                                ...notification,
                                id: notificationId,
                              })
                            }
                            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600"
                            title="Mark as read"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notificationId);
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete notification"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete notification</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="border-t flex-shrink-0 bg-background">
            <div className="p-2">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2 hover:bg-muted/50 rounded"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

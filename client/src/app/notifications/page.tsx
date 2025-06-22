"use client";
import React, { useEffect, useState } from "react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNotifications(1, 20, filter === "unread");
  }, [filter, fetchNotifications]);

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

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedPost) {
      return `/posts/${notification.relatedPost}`;
    }
    return "#";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "When you receive notifications, they'll appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group flex items-start space-x-4 p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                    !notification.isRead
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={getNotificationLink(notification)}
                      className="block"
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <p className="text-sm font-medium text-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From:{" "}
                        <strong>
                          {notification.sender.firstName}{" "}
                          {notification.sender.lastName}
                        </strong>
                        (@{notification.sender.username}) •{" "}
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </Link>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;

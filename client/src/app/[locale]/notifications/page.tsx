"use client";
import React, { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Link from "next/link";
import { Notification } from "@/typings/interfaces";
import { useTranslations, useLocale } from "next-intl";

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
  const tNotifications = useTranslations("notificationsPage");
  const tNotificationBell = useTranslations("notificationBell");
  const locale = useLocale();

  useEffect(() => {
    fetchNotifications(1, 20, filter === "unread");
  }, [filter, fetchNotifications]);

  const translateNotificationMessage = (notification: Notification): string => {
    const { type, message } = notification;

    // Try to extract user information from the original message
    let username = "";
    let name = "";

    // Extract information based on message patterns from backend
    if (message.includes("@")) {
      // Mention: "@username mentioned you in a comment"
      const mentionMatch = message.match(/@(\w+)/);
      username = mentionMatch ? mentionMatch[1] : "";
      return tNotificationBell("messages.mention", { username });
    } else if (message.includes("commented on your post")) {
      // Comment: "FirstName LastName commented on your post"
      const nameMatch = message.match(/^(.+?)\s+commented on your post/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.comment", { name });
    } else if (message.includes("replied to your comment")) {
      // Reply: "FirstName LastName replied to your comment"
      const nameMatch = message.match(/^(.+?)\s+replied to your comment/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.reply", { name });
    } else if (message.includes("bookmarked your post")) {
      // Bookmark: "FirstName LastName bookmarked your post"
      const nameMatch = message.match(/^(.+?)\s+bookmarked your post/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.bookmark", { name });
    } else if (message.includes("liked your comment")) {
      // Comment like: "FirstName LastName liked your comment"
      const nameMatch = message.match(/^(.+?)\s+liked your comment/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.commentLike", { name });
    } else if (message.includes("liked your post")) {
      // Post like: "FirstName LastName liked your post"
      const nameMatch = message.match(/^(.+?)\s+liked your post/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.like", { name });
    } else if (message.includes("started following you")) {
      // Follow: "FirstName LastName started following you"
      const nameMatch = message.match(/^(.+?)\s+started following you/);
      name = nameMatch ? nameMatch[1] : "";
      return tNotificationBell("messages.follow", { name });
    }

    // Fallback to original message if no pattern matches
    return message;
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
    if (
      notification.relatedPost &&
      typeof notification.relatedPost === "object"
    ) {
      const username = notification.relatedPost.postedBy?.username;
      const slug = notification.relatedPost.slug;
      if (username && slug) {
        return `/${username}/${slug}`;
      }
    }
    return "#";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    return true;
  });

  return (
    <div className="container mx-auto mt-16 px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {tNotifications("title")}
            </CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} {tNotifications("unread")}
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
                  {tNotifications("markAllRead")}
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
              {tNotifications("filters.all")}
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              {tNotifications("filters.unread")} ({unreadCount})
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
                  ? tNotifications("empty.noUnread")
                  : tNotifications("empty.noNotifications")}
              </h3>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? tNotifications("empty.caughtUp")
                  : tNotifications("empty.description")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {" "}
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
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
                          const notificationId =
                            notification._id || notification.id;
                          if (notificationId) {
                            markAsRead(notificationId);
                          }
                        }
                      }}
                    >
                      <p className="text-sm font-medium text-foreground mb-1">
                        {translateNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tNotifications("from")}:{" "}
                        <strong>
                          {notification.sender.firstName}{" "}
                          {notification.sender.lastName}
                        </strong>
                        (@{notification.sender.username}) •{" "}
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: locale === "es" ? es : enUS,
                        })}
                      </p>
                    </Link>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {" "}
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const notificationId =
                            notification._id || notification.id;
                          if (notificationId) {
                            markAsRead(notificationId);
                          }
                        }}
                        className="h-8 px-2"
                        title={tNotifications("markAsRead")}
                      >
                        <Circle className="h-4 w-4 fill-blue-500 text-blue-500 mr-1" />
                        <span className="sr-only md:not-sr-only">
                          {tNotifications("markAsRead")}
                        </span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const notificationId =
                          notification._id || notification.id;
                        if (notificationId) {
                          deleteNotification(notificationId);
                        }
                      }}
                      className="h-8 px-2 opacity-50 group-hover:opacity-100 transition-opacity"
                      title={tNotifications("delete")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive mr-1" />
                      <span className="sr-only md:not-sr-only">
                        {tNotifications("delete")}
                      </span>
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

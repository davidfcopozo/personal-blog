"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SocketContextType } from "@/typings/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { PostFetchType } from "@/typings/types";
import { PostInterface } from "@/typings/interfaces";
import { useToast } from "@/components/ui/use-toast";

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
  const updatePostInCache = (
    postId: string,
    updateFn: (post: PostInterface) => PostInterface
  ) => {
    let hasUpdated = false;

    queryClient.setQueryData<PostFetchType>(["posts"], (oldData) => {
      if (!oldData?.data || !Array.isArray(oldData.data)) {
        return oldData;
      }
      const updatedData = {
        ...oldData,
        data: oldData.data.map((post: PostInterface) => {
          if (post._id?.toString() === postId) {
            const updatedPost = updateFn(post);
            hasUpdated = true;
            return updatedPost;
          }
          return post;
        }),
      };
      return updatedData;
    });

    // Also update individual post cache if it exists. We need to check all possible single post cache keys
    const queries = queryClient.getQueryCache().findAll({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          Array.isArray(queryKey) &&
          queryKey.length === 2 &&
          queryKey[0] === "post" &&
          typeof queryKey[1] === "string"
        );
      },
    });

    queries.forEach((query) => {
      const [, slug] = query.queryKey as [string, string];
      queryClient.setQueryData(["post", slug], (oldData: any) => {
        if (!oldData?.data || oldData.data._id?.toString() !== postId) {
          return oldData;
        }
        const updatedPost = updateFn(oldData.data);
        hasUpdated = true;
        return {
          ...oldData,
          data: updatedPost,
        };
      });
    });

    if (!hasUpdated) {
      // Fallback: invalidate queries to refetch if cache update failed
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query.queryKey });
      });
    }
  };
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    const userId = currentUser?._id || currentUser?.data?._id;
    if (!userId) {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT?.replace("/api/v1", "") ||
      "http://localhost:8000";
    const newSocket = io(apiUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    });
    newSocket.on("connect", () => {
      setIsConnected(true);
      // Join user-specific room for receiving notifications
      newSocket.emit("join", userId);
    });
    newSocket.on("joinConfirmation", (data) => {});
    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });
    newSocket.on("connect_error", () => {
      setIsConnected(false);
    });
    newSocket.on("postLikeUpdate", (data) => {
      updatePostInCache(data.postId, (post) => {
        if (data.userId !== userId && post.postedBy === userId) {
          toast({
            title: `${getNotificationIcon("like")} Post Liked`,
            description: `Someone liked your post: "${post.title}"`,
            duration: 3000,
          });
        }
        const likes = post.likes || [];
        if (data.isLiked) {
          if (!likes.includes(data.userId)) {
            return { ...post, likes: [...likes, data.userId] };
          }
        } else {
          return {
            ...post,
            likes: likes.filter((id) => id !== data.userId),
          };
        }
        return post;
      });
    });
    newSocket.on("postBookmarkUpdate", (data) => {
      updatePostInCache(data.postId, (post) => {
        if (data.userId !== userId && post.postedBy === userId) {
          toast({
            title: `${getNotificationIcon("bookmark")} Post Bookmarked`,
            description: `Someone bookmarked your post: "${post.title}"`,
            duration: 3000,
          });
        }
        const bookmarks = post.bookmarks || [];
        if (data.isBookmarked) {
          if (!bookmarks.includes(data.userId)) {
            return { ...post, bookmarks: [...bookmarks, data.userId] };
          }
        } else {
          return {
            ...post,
            bookmarks: bookmarks.filter((id) => id !== data.userId),
          };
        }
        return post;
      });
    });
    newSocket.on("postCommentUpdate", (data) => {
      updatePostInCache(data.postId, (post) => {
        if (
          data.action === "add" &&
          data.userId !== userId &&
          post.postedBy === userId
        ) {
          toast({
            title: `${getNotificationIcon("comment")} New Comment`,
            description: `Someone commented on your post: "${post.title}"`,
            duration: 3000,
          });
        }
        const comments = post.comments || [];
        if (data.action === "add") {
          if (!comments.includes(data.commentId)) {
            return { ...post, comments: [...comments, data.commentId] };
          }
        } else if (data.action === "remove") {
          return {
            ...post,
            comments: comments.filter((id) => id !== data.commentId),
          };
        }
        return post;
      });
    }); // Handle real-time notifications
    newSocket.on("notification", (notification) => {
      // The useNotifications hook will handle this
    });

    newSocket.on("commentLikeUpdate", (data) => {
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData?.data || !Array.isArray(oldData.data)) {
          return oldData;
        }

        return {
          ...oldData,
          data: oldData.data.map((comment: any) => {
            if (comment._id?.toString() === data.commentId) {
              const likes = comment.likes || [];
              if (data.isLiked) {
                if (!likes.includes(data.userId)) {
                  return { ...comment, likes: [...likes, data.userId] };
                }
              } else {
                return {
                  ...comment,
                  likes: likes.filter((id: string) => id !== data.userId),
                };
              }
            }
            return comment;
          }),
        };
      });

      if (data.userId !== userId) {
        const comment = queryClient
          .getQueryData<any>(["comments"])
          ?.data?.find(
            (c: any) =>
              c._id?.toString() === data.commentId && c.postedBy === userId
          );

        if (comment && data.isLiked) {
          toast({
            title: `${getNotificationIcon("like")} Comment Liked`,
            description: "Someone liked your comment",
            duration: 3000,
          });
        }
      }
    });
    newSocket.on("newComment", (data) => {
      console.log("📡 Received newComment socket event:", {
        postId: data.postId,
        postSlug: data.postSlug,
        commentId: data.comment._id,
        commentAuthor: data.comment.postedBy?._id || data.comment.postedBy,
        currentUser: userId,
      });

      // For ALL users (including author), add the new comment to the cache
      // This ensures everyone sees the comment immediately
      queryClient.setQueryData<any>(["comments"], (oldData: any) => {
        if (!oldData) return [data.comment];

        // Check if comment already exists to avoid duplicates
        const exists = oldData.find((c: any) => c._id === data.comment._id);
        if (exists) {
          console.log("🔄 Comment already exists in cache, skipping");
          return oldData;
        }

        console.log("✅ Adding new comment to cache");
        return [...oldData, data.comment];
      });

      // Update post caches to increment comment count for all users
      updatePostInCache(data.postId, (post) => {
        const comments = post.comments || [];
        if (!comments.includes(data.comment._id)) {
          console.log("✅ Adding comment ID to post comments array");
          return { ...post, comments: [...comments, data.comment._id] };
        }
        return post;
      });

      // Show toast notification for post author if it's their post and they didn't create the comment
      if (data.comment.postedBy !== userId) {
        // Try to get post data from cache
        let postOwnerId = null;

        // First try to get from individual post cache
        const singlePostData = queryClient.getQueryData<any>([
          "post",
          data.postSlug,
        ]);
        if (singlePostData?.data?.postedBy) {
          postOwnerId = singlePostData.data.postedBy;
        }

        // If not found, try from posts list cache
        if (!postOwnerId) {
          const postsData = queryClient.getQueryData<any>(["posts"]);
          const postInList = postsData?.data?.find(
            (p: any) => p._id === data.postId
          );
          if (postInList?.postedBy) {
            postOwnerId = postInList.postedBy;
          }
        }

        // Check if current user is the post owner
        if (
          postOwnerId &&
          (postOwnerId === userId || postOwnerId.toString() === userId)
        ) {
          console.log("📬 Showing notification to post owner");
          toast({
            title: `${getNotificationIcon("comment")} New Comment`,
            description: `Someone commented on your post`,
            duration: 3000,
          });
        }
      }
    });
    newSocket.on("newReply", (data) => {
      console.log("📡 Received newReply socket event:", {
        postId: data.postId,
        postSlug: data.postSlug,
        parentCommentId: data.parentCommentId,
        replyId: data.reply._id,
        replyAuthor: data.reply.postedBy?._id || data.reply.postedBy,
        currentUser: userId,
      });

      // For ALL users (including author), add the new reply to the cache
      // This ensures everyone sees the reply immediately
      queryClient.setQueryData(
        [`replies-${data.parentCommentId}`],
        (oldData: any) => {
          if (!oldData) return [data.reply];

          // Check if reply already exists to avoid duplicates
          const exists = oldData.find((r: any) => r._id === data.reply._id);
          if (exists) {
            console.log("🔄 Reply already exists in cache, skipping");
            return oldData;
          }

          console.log("✅ Adding new reply to cache");
          return [...oldData, data.reply];
        }
      );

      // Also update the parent comment's replies array in the comments cache for all users
      queryClient.setQueryData(["comments"], (oldComments: any) => {
        if (!oldComments) return oldComments;

        return oldComments.map((comment: any) => {
          if (comment._id === data.parentCommentId) {
            const currentReplies = comment.replies || [];
            if (!currentReplies.includes(data.reply._id)) {
              console.log("✅ Adding reply ID to parent comment replies array");
              return {
                ...comment,
                replies: [...currentReplies, data.reply._id],
              };
            }
          }
          return comment;
        });
      });

      // Show toast notification for reply author if it's their comment and they didn't create the reply
      if (data.reply.postedBy !== userId) {
        const parentComment = queryClient.getQueryData<any>([
          "comment",
          data.parentCommentId,
        ]);

        if (parentComment?.data?.postedBy === userId) {
          console.log("📬 Showing notification to comment owner");
          toast({
            title: `${getNotificationIcon("reply")} New Reply`,
            description: `Someone replied to your comment`,
            duration: 3000,
          });
        }
      }
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [currentUser?._id, currentUser?.data?._id, isAuthLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

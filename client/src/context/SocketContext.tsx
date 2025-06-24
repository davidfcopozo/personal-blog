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
    });

    // Handle real-time notifications
    newSocket.on("notification", (notification) => {
      // The useNotifications hook will handle this
    });

    newSocket.on("commentLikeUpdate", (data) => {
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData)) {
          return oldData;
        }

        return oldData.map((comment: any) => {
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
        });
      });

      if (data.userId !== userId) {
        const comments = queryClient.getQueryData<any>(["comments"]);
        const comment = comments?.find(
          (c: any) =>
            c._id?.toString() === data.commentId &&
            (c.postedBy === userId ||
              c.postedBy?._id === userId ||
              c.postedBy?.toString() === userId)
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
      // Check if current user is the comment author
      const currentUserId = currentUser?._id || currentUser?.data?._id;
      const commentAuthorId =
        data.comment.postedBy?._id || data.comment.postedBy;
      const isCurrentUserAuthor = currentUserId === commentAuthorId;

      // For OTHER users (not the comment author), add the new comment to the cache
      // The author's cache will be updated by the mutation's onSuccess to avoid conflicts
      if (!isCurrentUserAuthor) {
        queryClient.setQueryData<any>(["comments"], (oldData: any) => {
          if (!oldData) return [data.comment];

          // Check if comment already exists to avoid duplicates
          const exists = oldData.find((c: any) => c._id === data.comment._id);
          if (exists) {
            return oldData;
          }

          return [...oldData, data.comment];
        });
      }

      // Show toast notification for post author if it's their post and they didn't create the comment
      if (!isCurrentUserAuthor) {
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
          (postOwnerId === currentUserId ||
            postOwnerId.toString() === currentUserId)
        ) {
          toast({
            title: `${getNotificationIcon("comment")} New Comment`,
            description: `Someone commented on your post`,
            duration: 3000,
          });
        }
      }
    });
    newSocket.on("newReply", (data) => {
      // Check if current user is the reply author
      const currentUserId = currentUser?._id || currentUser?.data?._id;
      const replyAuthorId = data.reply.postedBy?._id || data.reply.postedBy;
      const isCurrentUserAuthor = currentUserId === replyAuthorId;

      // For OTHER users (not the reply author), add the new reply to the cache
      // The author's cache will be updated by the mutation's onSuccess to avoid conflicts
      if (!isCurrentUserAuthor) {
        // Find and update the correct query key with IDs array
        const queriesForParent = queryClient.getQueryCache().findAll({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              Array.isArray(queryKey) &&
              queryKey.length === 2 &&
              queryKey[0] === `replies-${data.parentCommentId}` &&
              Array.isArray(queryKey[1])
            );
          },
        });

        queriesForParent.forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData) return [data.reply];

            // Check if reply already exists to avoid duplicates
            const exists = oldData.find((r: any) => r._id === data.reply._id);
            if (exists) {
              return oldData;
            }

            return [...oldData, data.reply];
          });
        });

        // Update the global replies cache
        queryClient.setQueryData(["replies"], (oldReplies: any) => {
          if (!oldReplies) return [data.reply];

          // Check if reply already exists to avoid duplicates
          const exists = oldReplies.find((r: any) => r._id === data.reply._id);
          if (exists) {
            return oldReplies;
          }

          return [...oldReplies, data.reply];
        });

        // Update the parent comment's replies array in the comments cache
        queryClient.setQueryData(["comments"], (oldComments: any) => {
          if (!oldComments) return oldComments;

          return oldComments.map((comment: any) => {
            if (comment._id === data.parentCommentId) {
              const currentReplies = comment.replies || [];
              if (!currentReplies.includes(data.reply._id)) {
                return {
                  ...comment,
                  replies: [...currentReplies, data.reply._id],
                };
              }
            }
            return comment;
          });
        });

        // If this is a nested reply, also update the grandparent's replies cache
        if (data.reply.parentType === "reply") {
          // Find and update grandparent queries
          const grandparentQueries = queryClient.getQueryCache().findAll({
            predicate: (query) => {
              const queryKey = query.queryKey;
              return (
                Array.isArray(queryKey) &&
                queryKey.length === 2 &&
                queryKey[0] ===
                  `replies-${
                    data.reply.grandparentId || data.parentCommentId
                  }` &&
                Array.isArray(queryKey[1])
              );
            },
          });

          grandparentQueries.forEach((query) => {
            queryClient.setQueryData(query.queryKey, (oldReplies: any) => {
              if (!oldReplies) return oldReplies;

              return oldReplies.map((reply: any) => {
                if (reply._id === data.parentCommentId) {
                  const currentReplies = reply.replies || [];
                  if (!currentReplies.includes(data.reply._id)) {
                    return {
                      ...reply,
                      replies: [...currentReplies, data.reply._id],
                    };
                  }
                }
                return reply;
              });
            });
          });
        }
      }

      // Show toast notification for reply recipient if they didn't create the reply
      if (!isCurrentUserAuthor) {
        // Check if current user is the parent comment/reply author
        const comments = queryClient.getQueryData<any>(["comments"]);
        const parentComment = comments?.find(
          (c: any) =>
            c._id === data.parentCommentId &&
            (c.postedBy === currentUserId ||
              c.postedBy?._id === currentUserId ||
              c.postedBy?.toString() === currentUserId?.toString())
        );

        if (parentComment) {
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

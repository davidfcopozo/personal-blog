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

    const postsUpdated = queryClient.setQueryData<PostFetchType>(
      ["posts"],
      (oldData) => {
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
      }
    );

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

    console.log("Connecting to Socket.IO server at:", apiUrl);
    console.log("User ID:", userId);

    const newSocket = io(apiUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    });
    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server", newSocket.id);
      setIsConnected(true);
      // Join user-specific room for receiving notifications
      newSocket.emit("join", userId);
      console.log("🔌 Joined room:", userId);
    });

    newSocket.on("joinConfirmation", (data) => {
      console.log("🎯 Join confirmation received:", data);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.IO server. Reason:", reason);
      setIsConnected(false);
    });
    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error);
      setIsConnected(false);
    });
    newSocket.on("postLikeUpdate", (data) => {
      console.log("👍 Received like update:", data);

      // Debug: Check what queries are in the cache
      const allQueries = queryClient.getQueryCache().getAll();
      console.log(
        "All queries in cache:",
        allQueries.map((q) => ({
          queryKey: q.queryKey,
          hasData: !!q.state.data,
        }))
      );

      console.log(
        "Current posts cache before update:",
        queryClient.getQueryData(["posts"])
      );

      updatePostInCache(data.postId, (post) => {
        console.log("Updating post:", post._id, "with like data:", data);

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
            const updatedPost = { ...post, likes: [...likes, data.userId] };
            console.log("Updated post with new like:", updatedPost);
            return updatedPost;
          }
        } else {
          const updatedPost = {
            ...post,
            likes: likes.filter((id) => id !== data.userId),
          };
          console.log("Updated post with removed like:", updatedPost);
          return updatedPost;
        }
        return post;
      });

      console.log(
        "Posts cache after update:",
        queryClient.getQueryData(["posts"])
      );
    });
    newSocket.on("postBookmarkUpdate", (data) => {
      console.log("🔖 Received bookmark update:", data);

      // Debug: Check what queries are in the cache
      const allQueries = queryClient.getQueryCache().getAll();
      console.log(
        "All queries in cache:",
        allQueries.map((q) => ({
          queryKey: q.queryKey,
          hasData: !!q.state.data,
        }))
      );

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
      console.log("🔔 Received notification:", notification);
      // The useNotifications hook will handle this
    });

    // Test the connection
    newSocket.on("connect", () => {
      console.log("Testing socket connection...");
      newSocket.emit("ping", "test");
    });

    setSocket(newSocket);
    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.close();
    };
  }, [currentUser?._id, currentUser?.data?._id, isAuthLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

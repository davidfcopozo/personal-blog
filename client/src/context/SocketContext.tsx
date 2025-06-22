"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SocketContextType } from "@/typings/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { PostFetchType } from "@/typings/types";
import { PostInterface } from "@/typings/interfaces";

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
  const queryClient = useQueryClient(); // Helper function to update a specific post in the React Query cache
  const updatePostInCache = (
    postId: string,
    updateFn: (post: PostInterface) => PostInterface
  ) => {
    console.log("🔄 Updating post in cache:", postId);

    // Update posts list cache
    const updated = queryClient.setQueryData<PostFetchType>(
      ["posts"],
      (oldData) => {
        if (!oldData?.data || !Array.isArray(oldData.data)) {
          console.log("No posts data found in cache");
          return oldData;
        }

        console.log("Found posts data, updating...");
        const updatedData = {
          ...oldData,
          data: oldData.data.map((post: PostInterface) => {
            if (post._id?.toString() === postId) {
              console.log("Found matching post to update:", post._id);
              const updatedPost = updateFn(post);
              console.log("Post updated from:", post, "to:", updatedPost);
              return updatedPost;
            }
            return post;
          }),
        };

        console.log("Cache updated successfully");
        return updatedData;
      }
    );

    console.log("setQueryData returned:", updated);
  };

  useEffect(() => {
    console.log("SocketContext useEffect triggered.");
    console.log("Auth loading:", isAuthLoading);
    console.log("User:", currentUser);
    // Don't try to connect while auth is still loading
    if (isAuthLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }

    const userId = currentUser?._id || currentUser?.data?._id;
    if (!userId) {
      console.log("No user ID, not connecting to socket. User:", currentUser);
      // Clean up existing socket if user logs out
      if (socket) {
        console.log("Cleaning up existing socket connection");
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

    // Listen for global post updates for real-time interaction counts
    newSocket.on("postLikeUpdate", (data) => {
      console.log("👍 Received like update:", data);
      console.log(
        "Current posts cache before update:",
        queryClient.getQueryData(["posts"])
      );

      updatePostInCache(data.postId, (post) => {
        console.log("Updating post:", post._id, "with like data:", data);
        const likes = post.likes || [];
        if (data.isLiked) {
          // Add like if not already present
          if (!likes.includes(data.userId)) {
            const updatedPost = { ...post, likes: [...likes, data.userId] };
            console.log("Updated post with new like:", updatedPost);
            return updatedPost;
          }
        } else {
          // Remove like
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
      updatePostInCache(data.postId, (post) => {
        const bookmarks = post.bookmarks || [];
        if (data.isBookmarked) {
          // Add bookmark if not already present
          if (!bookmarks.includes(data.userId)) {
            return { ...post, bookmarks: [...bookmarks, data.userId] };
          }
        } else {
          // Remove bookmark
          return {
            ...post,
            bookmarks: bookmarks.filter((id) => id !== data.userId),
          };
        }
        return post;
      });
    });

    newSocket.on("postCommentUpdate", (data) => {
      console.log("� Received comment update:", data);
      updatePostInCache(data.postId, (post) => {
        const comments = post.comments || [];
        if (data.action === "add") {
          // Add comment if not already present
          if (!comments.includes(data.commentId)) {
            return { ...post, comments: [...comments, data.commentId] };
          }
        } else if (data.action === "remove") {
          // Remove comment
          return {
            ...post,
            comments: comments.filter((id) => id !== data.commentId),
          };
        }
        return post;
      });
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

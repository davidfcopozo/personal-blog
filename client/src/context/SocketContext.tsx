"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SocketContextType } from "@/typings/interfaces";

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

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.IO server. Reason:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error);
      setIsConnected(false);
    });

    // Listen for notifications
    newSocket.on("notification", (data) => {
      console.log("🔔 Received notification:", data);
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

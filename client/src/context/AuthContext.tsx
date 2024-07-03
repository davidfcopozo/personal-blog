"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

type AuthContextType = {
  currentUser: any | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  socialLogin: (provider: "github" | "google") => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadCurrentUser = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        console.log("session===>", session);

        try {
          const { data } = await axios.get(`/api/users/${session.user.id}`);
          setCurrentUser(data);
          console.log("data===>", data);
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    const session = await getSession();
    if (session?.user?.id) {
      const { data } = await axios.get(`/api/users/${session.user.id}`);
      setCurrentUser(data);
      queryClient.setQueryData(["currentUser"], data);
    }
  };

  const socialLogin = async (provider: "github" | "google") => {
    const result = await signIn(provider, { redirect: false });
    if (result?.error) {
      throw new Error(result.error);
    }

    const session = await getSession();
    if (session?.user?.id) {
      const { data } = await axios.get(`/api/users/${session.user.id}`);
      setCurrentUser(data);
      queryClient.setQueryData(["currentUser"], data);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setCurrentUser(null);
    queryClient.setQueryData(["currentUser"], null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { AuthContextType } from "@/typings/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: currentUser,
    refetch: refetchUser,
    isFetching: isUserFetching,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const session = await getSession();
      if (session?.user?.id) {
        const { data } = await axios.get(`/api/users/${session.user.id}`);
        return data;
      }
      return null;
    },
    enabled: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      await refetchUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, [refetchUser]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...credentials,
        callbackUrl: "/",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      await refetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        throw new Error(result.error);
      }

      await refetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.get("/api/auth/logout");
      await signOut({ callbackUrl: "/" });
      queryClient.setQueryData(["currentUser"], null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        socialLogin,
        logout,
        isUserFetching,
        isUserLoading,
        refetchUser,
      }}
    >
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

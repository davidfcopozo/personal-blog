"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  useMemo,
  useCallback,
} from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { AuthContextType } from "@/typings/types";
import { clearSessionCache } from "@/hooks/useSessionUserId";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext";

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
    isPending: isUserPending,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const session = await getSession();
      if (!session?.user?.id) {
        return null;
      }
      try {
        const { data } = await axios.get(`/api/auth/me`);
        return data;
      } catch (error) {
        return null;
      }
    },
    enabled: true, // Enable automatic fetching
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const initializeAuth = async () => {
      if (!currentUser && !isUserLoading) {
        await refetchUser();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [currentUser, isUserLoading, refetchUser]);
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          ...credentials,
          redirect: false,
        });
        if (result?.error) {
          throw new Error(result.error);
        }
        setTimeout(async () => {
          clearSessionCache(); // Clear cache so it gets refreshed with new session
          await refetchUser();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [refetchUser]
  );
  const socialLogin = useCallback(
    async (provider: "github" | "google") => {
      setIsLoading(true);
      try {
        const result = await signIn(provider, { redirect: false });
        if (result?.error) {
          throw new Error(result.error);
        }
        setTimeout(async () => {
          clearSessionCache(); // Clear cache so it gets refreshed with new session
          await refetchUser();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [refetchUser]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.get("/api/auth/logout");
      await signOut({ callbackUrl: "/" });
      queryClient.setQueryData(["currentUser"], null);
      clearSessionCache(); // Clear the cached session when logging out
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      currentUser,
      isLoading,
      login,
      socialLogin,
      logout,
      isUserFetching,
      isUserLoading,
      isUserPending,
      refetchUser,
    }),
    [
      currentUser,
      isLoading,
      login,
      socialLogin,
      logout,
      isUserFetching,
      isUserLoading,
      isUserPending,
      refetchUser,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

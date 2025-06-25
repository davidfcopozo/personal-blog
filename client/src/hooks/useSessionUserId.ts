import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

let cachedUserId: string | null = null;
let isSessionLoading = false;
let sessionPromise: Promise<string | null> | null = null;

export const useSessionUserId = () => {
  const [userId, setUserId] = useState<string | null>(cachedUserId);
  const [isLoading, setIsLoading] = useState(isSessionLoading);

  useEffect(() => {
    const getUserId = async () => {
      // If we already have a cached value, use it
      if (cachedUserId !== null) {
        setUserId(cachedUserId);
        setIsLoading(false);
        return;
      }

      // If we're already fetching, wait for the existing promise
      if (sessionPromise) {
        const result = await sessionPromise;
        setUserId(result);
        setIsLoading(false);
        return;
      }

      // Start a new fetch and cache the promise
      setIsLoading(true);
      isSessionLoading = true;

      sessionPromise = (async () => {
        try {
          const session = await getSession();
          const id = session?.user?.id ? String(session.user.id) : null;
          cachedUserId = id;
          isSessionLoading = false;
          return id;
        } catch (error) {
          console.error("Error getting session:", error);
          cachedUserId = null;
          isSessionLoading = false;
          return null;
        }
      })();

      const result = await sessionPromise;
      setUserId(result);
      setIsLoading(false);
    };

    getUserId();
  }, []);

  return { userId, isLoading };
};

// Function to clear the cache when user logs out
export const clearSessionCache = () => {
  cachedUserId = null;
  sessionPromise = null;
  isSessionLoading = false;
};

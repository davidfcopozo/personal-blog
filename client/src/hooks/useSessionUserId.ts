import { useState, useEffect, useRef } from "react";
import { getSession } from "next-auth/react";

let cachedUserId: string | null = null;
let isSessionLoading = false;
let sessionPromise: Promise<string | null> | null = null;
let sessionListeners: Set<(userId: string | null, isLoading: boolean) => void> =
  new Set();

export const useSessionUserId = () => {
  const [userId, setUserId] = useState<string | null>(cachedUserId);
  const [isLoading, setIsLoading] = useState(isSessionLoading);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const updateState = (newUserId: string | null, newIsLoading: boolean) => {
      if (isMountedRef.current) {
        setUserId(newUserId);
        setIsLoading(newIsLoading);
      }
    };

    const getUserId = async () => {
      // If we already have a cached value and not loading, use it immediately
      if (cachedUserId !== null && !isSessionLoading) {
        updateState(cachedUserId, false);
        return;
      }

      // If we're already fetching, wait for the existing promise
      if (sessionPromise) {
        try {
          const result = await sessionPromise;
          updateState(result, false);
          return;
        } catch (error) {
          updateState(null, false);
          return;
        }
      }

      // Start a new fetch and cache the promise
      updateState(cachedUserId, true);
      isSessionLoading = true;

      // Notify all listeners that loading started
      sessionListeners.forEach((listener) => listener(cachedUserId, true));

      sessionPromise = (async () => {
        try {
          const session = await getSession();
          const id = session?.user?.id ? String(session.user.id) : null;
          cachedUserId = id;
          isSessionLoading = false;

          // Notify all listeners of the new user ID
          sessionListeners.forEach((listener) => listener(id, false));

          return id;
        } catch (error) {
          console.error("Error getting session:", error);
          cachedUserId = null;
          isSessionLoading = false;

          // Notify all listeners of the error
          sessionListeners.forEach((listener) => listener(null, false));

          return null;
        }
      })();

      try {
        const result = await sessionPromise;
        updateState(result, false);
      } catch (error) {
        updateState(null, false);
      }
    };

    // Add this component as a listener
    sessionListeners.add(updateState);

    getUserId();

    // Cleanup listener on unmount
    return () => {
      isMountedRef.current = false;
      sessionListeners.delete(updateState);
    };
  }, []);

  return { userId, isLoading };
};

// Function to clear the cache when user logs out
export const clearSessionCache = () => {
  cachedUserId = null;
  sessionPromise = null;
  isSessionLoading = false;
};

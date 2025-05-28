"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthAction } from "@/components/auth-modal";

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<AuthAction>("like");
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null
  );
  const { currentUser } = useAuth();

  const isAuthenticated = !!currentUser?.data;

  const requireAuth = (action: AuthAction, callback: () => void) => {
    if (isAuthenticated) {
      // User is authenticated, execute the action immediately
      callback();
    } else {
      // User is not authenticated, show the modal
      setCurrentAction(action);
      // Store the callback to be executed after authentication
      setPendingCallback(() => callback);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPendingCallback(null);
  };

  const handleSuccess = () => {
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
    setIsOpen(false);
  };

  return {
    isOpen,
    currentAction,
    isAuthenticated,
    requireAuth,
    closeModal,
    handleSuccess,
  };
}

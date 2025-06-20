import { CommentNavigationGuardOptions } from "@/typings/interfaces";
import { useEffect, useState, useCallback, useRef } from "react";

export const useCommentNavigationGuard = ({
  content,
  originalContent = "",
  isEditing = false,
  onSave,
  enabled = true,
}: CommentNavigationGuardOptions) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const hasUnsavedChanges = useCallback(() => {
    if (!enabled) return false;

    const isContentEmpty = (htmlContent: string): boolean => {
      if (!htmlContent) return true;
      const textContent = htmlContent
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return textContent.length === 0;
    };

    const currentContentEmpty = isContentEmpty(content);
    const originalContentEmpty = isContentEmpty(originalContent);

    if (currentContentEmpty && originalContentEmpty) {
      return false;
    }

    if (currentContentEmpty !== originalContentEmpty) {
      return true;
    }

    const normalizedCurrent = content.replace(/\s+/g, " ").trim();
    const normalizedOriginal = originalContent.replace(/\s+/g, " ").trim();

    return normalizedCurrent !== normalizedOriginal;
  }, [content, originalContent, enabled]);

  // Handle beforeunload for browser navigation
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        event.preventDefault();
        event.returnValue = isEditing
          ? "You have unsaved changes to your comment. Are you sure you want to leave?"
          : "You have started writing a comment. Are you sure you want to leave?";
        return event.returnValue;
      }
    },
    [hasUnsavedChanges, isEditing]
  );

  useEffect(() => {
    if (hasUnsavedChanges()) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, handleBeforeUnload]);

  const handleCancelWithGuard = useCallback(
    (cancelAction: () => void) => {
      if (hasUnsavedChanges() && enabled) {
        pendingActionRef.current = cancelAction;
        setIsDialogOpen(true);
      } else {
        cancelAction();
      }
    },
    [hasUnsavedChanges, enabled]
  );

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave();
      setIsDialogOpen(false);

      if (pendingActionRef.current) {
        pendingActionRef.current();
        pendingActionRef.current = null;
      }
    } catch (error) {
      console.error("Failed to save comment:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  const handleDiscard = useCallback(() => {
    setIsDialogOpen(false);

    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    pendingActionRef.current = null;
  }, []);

  return {
    hasUnsavedChanges: hasUnsavedChanges(),
    isDialogOpen,
    isSaving,
    handleCancelWithGuard,
    handleSave,
    handleDiscard,
    handleDialogClose,
  };
};

export default useCommentNavigationGuard;

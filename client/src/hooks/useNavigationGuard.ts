import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationGuardOptions } from "@/typings/interfaces";

export const useNavigationGuard = ({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
  onBeforeUnload,
  onSave,
  autoSave,
  enableDialog = true,
}: NavigationGuardOptions) => {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const pendingNavigationRef = useRef<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        onBeforeUnload?.();
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    [hasUnsavedChanges, message, onBeforeUnload]
  );

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave();
      setIsDialogOpen(false);

      if (pendingNavigationRef.current) {
        isNavigatingRef.current = true;
        router.push(pendingNavigationRef.current);
        pendingNavigationRef.current = null;
      }
    } catch (error) {
      console.error("Failed to save:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [onSave, router]);

  const handleDiscard = useCallback(() => {
    setIsDialogOpen(false);

    if (pendingNavigationRef.current) {
      isNavigatingRef.current = true;
      router.push(pendingNavigationRef.current);
      pendingNavigationRef.current = null;
    }
  }, [router]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    pendingNavigationRef.current = null;
  }, []);

  const handleRouteChange = useCallback(
    async (url: string) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        if (enableDialog) {
          pendingNavigationRef.current = url;
          setIsDialogOpen(true);
        } else {
          // Fall back to basic confirm dialog
          const shouldProceed = window.confirm(message);
          if (shouldProceed) {
            if (autoSave) {
              try {
                await autoSave();
              } catch (error) {
                console.error("Auto-save failed:", error);
              }
            }
            isNavigatingRef.current = true;
            router.push(url);
          }
        }
        return;
      }
      router.push(url);
    },
    [hasUnsavedChanges, message, autoSave, router, enableDialog]
  );

  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, handleBeforeUnload]);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      isNavigatingRef.current = false;
      pendingNavigationRef.current = null;
    }
  }, [hasUnsavedChanges]);

  return {
    navigateWithGuard: handleRouteChange,
    isNavigating: isNavigatingRef.current,
    isDialogOpen,
    isSaving,
    handleSave,
    handleDiscard,
    handleDialogClose,
  };
};

export default useNavigationGuard;

"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => Promise<void>;
  onDiscard: () => void;
  title?: string;
  description?: string;
  saveButtonText?: string;
  discardButtonText?: string;
  isSaving?: boolean;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  title = "Unsaved Changes",
  description = "You have unsaved changes. What would you like to do?",
  saveButtonText = "Save Changes",
  discardButtonText = "Discard Changes",
  isSaving = false,
}) => {
  const t = useTranslations("editor");
  const tCommon = useTranslations("common");
  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave();
        onClose();
      } catch (error) {
        console.error("Failed to save:", error);
        // Keep dialog open if save fails
      }
    }
  };

  const handleDiscard = () => {
    onDiscard();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-amber-500" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onClose} className="order-3 sm:order-1">
            {tCommon("cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDiscard}
            className="order-2 sm:order-2 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {discardButtonText}
          </Button>
          {onSave && (
            <AlertDialogAction
              onClick={handleSave}
              disabled={isSaving}
              className="order-1 sm:order-3 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? t("saving") : saveButtonText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesDialog;

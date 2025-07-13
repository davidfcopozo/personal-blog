"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CommentEditorToolbar from "./comment-editor-toolbar";
import { Send } from "lucide-react";
import { CommentEditorProps } from "@/typings/interfaces";
import { useEffect } from "react";
import "@/styles/tiptap.css";
import {
  createConfiguredLowlight,
  extensionConfigs,
} from "@/utils/blog-editor";
import { useCommentNavigationGuard } from "@/hooks/useCommentNavigationGuard";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { useTranslations } from "next-intl";

// Create lowlight instance
const lowlight = createConfiguredLowlight();

export default function CommentEditor({
  onSubmit,
  onCancel,
  placeholder,
  maxHeight = 300,
  showCancelButton,
  value: content,
  onChange,
  commentMutationStatus,
  isEditing = false,
  originalContent,
}: CommentEditorProps & { isEditing?: boolean }) {
  const t = useTranslations("editor");
  const {
    hasUnsavedChanges,
    isDialogOpen,
    isSaving: isNavigationSaving,
    handleCancelWithGuard,
    handleSave: handleNavigationSave,
    handleDiscard,
    handleDialogClose,
  } = useCommentNavigationGuard({
    content,
    originalContent: originalContent || (isEditing ? content : ""),
    isEditing,
    onSave: async () => {
      if (editor) {
        const htmlContent = editor.getHTML();
        const textContent = editor.getText();
        if (textContent.trim()) {
          await new Promise<void>((resolve, reject) => {
            try {
              onSubmit(htmlContent);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        }
      }
    },
    enabled: true,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure(extensionConfigs.starterKit),
      CodeBlockLowlight.configure({
        lowlight,
        ...extensionConfigs.codeBlockLowlight,
      }),
      Underline,
      Link.configure(extensionConfigs.link),
      TextStyle,
      Color,
      Highlight.configure(extensionConfigs.highlight),
      Placeholder.configure({
        placeholder: placeholder || t("placeholderComment"),
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);
  const handleSubmit = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      if (textContent.trim()) {
        onSubmit(htmlContent);
      }
    }
  };

  if (!editor) {
    return (
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground rounded-md">
        <div className="p-4">
          <div className="min-h-[100px] flex items-center justify-center text-muted-foreground">
            Loading editor...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground/20 rounded-md overflow-auto">
        <CommentEditorToolbar editor={editor} />
        <div
          className="relative"
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
        >
          <EditorContent
            editor={editor}
            className="bg-background text-foreground [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-3"
          />
        </div>
      </Card>{" "}
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && showCancelButton && (
          <Button
            variant="outline"
            onClick={() => handleCancelWithGuard(onCancel)}
            className="py-4"
          >
            Cancel
          </Button>
        )}{" "}
        <Button
          onClick={handleSubmit}
          className="gap-2"
          disabled={commentMutationStatus === "pending"}
        >
          <Send className="w-4 h-4" />
          {isEditing ? "Update" : "Submit"}
        </Button>
      </div>{" "}
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleNavigationSave}
        onDiscard={handleDiscard}
        title={isEditing ? "Unsaved Comment Edits" : "Unsaved Comment"}
        description={
          isEditing
            ? "You have unsaved changes to your comment. Would you like to save them before canceling?"
            : "You have started writing a comment. Would you like to save it before canceling?"
        }
        saveButtonText={isEditing ? "Save Changes" : "Submit Comment"}
        discardButtonText="Discard Changes"
        isSaving={isNavigationSaving}
      />
    </>
  );
}

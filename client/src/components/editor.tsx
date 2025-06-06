import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import { modules, REDO_ICON, UNDO_ICON } from "@/utils/blog-editor";
import {
  EditorProps,
  QuillHistoryHandler,
  SVGToolbarIcons,
} from "@/typings/interfaces";
import { ImageUploadModal } from "./image-upload-modal";
import { useImageManager } from "@/hooks/useImageManager";
import hljs from "highlight.js";

// Extend Quill types
declare global {
  interface Window {
    Quill: typeof Quill;
  }
}

const Editor = ({
  value,
  onChange,
  handleImageUpload,
  onEditorReady,
}: EditorProps) => {
  const editorRef = useRef<ReactQuill>(null);
  const {
    uploadImage,
    userImages,
    isLoadingImages,
    deleteImage,
    updateImageMetadata,
  } = useImageManager();
  const [isImageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    index: number;
    length: number;
  } | null>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // Notify parent when editor is ready
  useEffect(() => {
    if (editorRef.current && !editorLoaded) {
      setEditorLoaded(true);
      if (onEditorReady) {
        onEditorReady();
      }
    }
  }, [editorLoaded, onEditorReady]);

  const openImageUploadModal = useCallback(() => {
    // Save current cursor position before opening modal
    if (editorRef.current) {
      const quill = editorRef.current.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        setCursorPosition(selection);
      }
    }
    setImageUploadModalOpen(true);
  }, []);

  const closeImageUploadModal = useCallback(() => {
    setImageUploadModalOpen(false);
  }, []);

  const handleInsertImage = useCallback(
    (url: string) => {
      if (editorRef.current) {
        const quill = editorRef.current.getEditor();

        let insertPosition = cursorPosition ? cursorPosition.index : 0;

        // If no saved position, try to get current selection
        if (!cursorPosition) {
          const currentSelection = quill.getSelection();
          if (currentSelection) {
            insertPosition = currentSelection.index;
          }
        }

        quill.focus();

        quill.insertEmbed(insertPosition, "image", url);

        // Move cursor after the image
        quill.setSelection(insertPosition + 1, 0);

        setCursorPosition(null);
      }
    },
    [cursorPosition]
  );

  // to ensure images get stored in both Firebase and DB
  const handleEditorImageUpload = useCallback(
    async (file: File) => {
      try {
        // Upload to Firebase using the existing function
        const url = await handleImageUpload(file);

        // Also upload metadata to the DB
        await uploadImage(file);

        return url;
      } catch (error) {
        throw error;
      }
    },
    [handleImageUpload, uploadImage]
  );

  let icons = Quill.import("ui/icons") as SVGToolbarIcons;

  icons["undo"] = UNDO_ICON;
  icons["redo"] = REDO_ICON;

  const undoHandler = useCallback(() => {
    if (editorRef && "current" in editorRef && editorRef.current) {
      const quillEditor = editorRef.current.getEditor();
      const history = quillEditor.getModule("history") as QuillHistoryHandler;
      return history.undo();
    }
  }, []);

  const redoHandler = useCallback(() => {
    if (editorRef && "current" in editorRef && editorRef.current) {
      const quillEditor = editorRef.current.getEditor();
      const history = quillEditor.getModule("history") as QuillHistoryHandler;
      return history.redo();
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const toolbar = editorRef.current.getEditor().getModule("toolbar") as any;
      toolbar.addHandler("image", openImageUploadModal);
      toolbar.addHandler("undo", undoHandler);
      toolbar.addHandler("redo", redoHandler);
    }
  }, [openImageUploadModal, undoHandler, redoHandler]);

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      // Configure languages for better detection
      const languages = [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "c",
        "csharp",
        "cs",
        "php",
        "ruby",
        "go",
        "rust",
        "html",
        "xml",
        "css",
        "scss",
        "sass",
        "json",
        "yaml",
        "sql",
        "bash",
        "shell",
        "powershell",
        "dockerfile",
        "markdown",
        "plaintext",
      ];

      const Syntax = Quill.import("modules/syntax") as any;
      const editor = editorRef.current.getEditor();

      // Store a queue of texts being processed to handle async detection
      const processingQueue = new Set<string>();

      // Override the highlight function to capture language detection
      Syntax.DEFAULTS.highlight = (text: string) => {
        // Clean the text for better detection
        const cleanText = text.trim();
        if (!cleanText) {
          return hljs.highlight("", { language: "plaintext" }).value;
        }

        const result = hljs.highlightAuto(cleanText, languages);
        const detectedLanguage = result.language || "plaintext";

        // Create a unique identifier for this text
        const textId = btoa(cleanText).substring(0, 20);

        if (!processingQueue.has(textId)) {
          processingQueue.add(textId);

          // Use setTimeout to ensure DOM is updated
          setTimeout(() => {
            // Only target .ql-code-block elements (not containers)
            const codeBlocks =
              editor.root.querySelectorAll("div.ql-code-block");

            for (const block of codeBlocks) {
              const blockElement = block as HTMLElement;
              const blockText = blockElement.textContent?.trim() || "";

              // Check if this block matches our text and doesn't already have correct language
              if (
                blockText === cleanText &&
                (!blockElement.hasAttribute("data-language") ||
                  blockElement.getAttribute("data-language") !==
                    detectedLanguage)
              ) {
                blockElement.setAttribute("data-language", detectedLanguage);
                break;
              }
            }

            processingQueue.delete(textId);
          }, 50);
        }

        return result.value;
      };

      // Add event listener for content changes to reapply language detection
      const handleTextChange = () => {
        setTimeout(() => {
          // Only process .ql-code-block elements
          const codeBlocks = editor.root.querySelectorAll("div.ql-code-block");

          codeBlocks.forEach((block) => {
            const blockElement = block as HTMLElement;
            const text = blockElement.textContent?.trim() || "";

            if (text && !blockElement.hasAttribute("data-language")) {
              try {
                const result = hljs.highlightAuto(text, languages);
                const language = result.language || "plaintext";
                blockElement.setAttribute("data-language", language);
              } catch (error) {
                blockElement.setAttribute("data-language", "plaintext");
              }
            }
          });
        }, 300);
      };

      editor.on("text-change", handleTextChange);

      // Initial scan for existing code blocks
      setTimeout(() => {
        handleTextChange();
      }, 1000);

      // Cleanup function
      return () => {
        editor.off("text-change", handleTextChange);
      };
    }
  }, []);

  return (
    <>
      <ReactQuill
        key="quil-editor"
        ref={editorRef}
        className="h-screen w-full"
        value={value}
        onChange={onChange}
        modules={{
          ...modules,
          toolbar: {
            ...modules.toolbar,
            handlers: {
              image: openImageUploadModal,
              undo: undoHandler,
              redo: redoHandler,
            },
          },
        }}
      />
      <ImageUploadModal
        isImageUploadModalOpen={isImageUploadModalOpen}
        openImageUploadModal={closeImageUploadModal}
        onInsertImage={handleInsertImage}
        handleImageUpload={handleEditorImageUpload}
        images={userImages}
        onDeleteImage={deleteImage}
        onUpdate={updateImageMetadata}
        isLoadingImages={isLoadingImages}
      />
    </>
  );
};

Editor.displayName = "Editor";

export default Editor;

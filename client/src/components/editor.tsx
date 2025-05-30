import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import { formats, modules, REDO_ICON, UNDO_ICON } from "@/utils/blog-editor";
import {
  EditorProps,
  QuillHistoryHandler,
  SVGToolbarIcons,
} from "@/typings/interfaces";
import { ImageUploadModal } from "./image-upload-modal";
import { useImageManager } from "@/hooks/useImageManager";

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
        console.error("Error uploading image:", error);
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

  return (
    <>
      <ReactQuill
        key="quil-editor"
        ref={editorRef}
        className="h-screen w-full"
        formats={formats}
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

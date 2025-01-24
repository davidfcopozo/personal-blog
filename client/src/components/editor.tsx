import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { formats, modules, REDO_ICON, UNDO_ICON } from "@/utils/blog-editor";
import { EditorProps, ImageInterface } from "@/typings/interfaces";
import { ImageUploadModal } from "./image-upload-modal";

const Editor = ({ value, onChange, handleImageUpload }: EditorProps) => {
  const editorRef = useRef<ReactQuill>(null);
  const [isImageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageInterface[]>([]);

  const openImageUploadModal = useCallback(() => {
    setImageUploadModalOpen((prev) => !prev);
  }, []);

  const handleInsertImage = useCallback(
    (url: string) => {
      if (editorRef.current) {
        const quill = editorRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", url);
        quill.setSelection(range.index + 1, 1);
      }
    },
    [editorRef]
  );

  const handleDirectImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
          const url = await handleImageUpload(file);
          handleInsertImage(url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  }, [handleImageUpload, handleInsertImage]);

  let icons = Quill.import("ui/icons");
  icons["undo"] = UNDO_ICON;
  icons["redo"] = REDO_ICON;

  const undoHandler = useCallback(() => {
    if (editorRef && "current" in editorRef && editorRef.current) {
      const quillEditor = editorRef.current.getEditor();
      const history = quillEditor.getModule("history");
      return history.undo();
    }
  }, []);

  const redoHandler = useCallback(() => {
    if (editorRef && "current" in editorRef && editorRef.current) {
      const quillEditor = editorRef.current.getEditor();
      const history = quillEditor.getModule("history");
      return history.redo();
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const toolbar = editorRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", openImageUploadModal);
      toolbar.addHandler("undo", undoHandler);
      toolbar.addHandler("redu", redoHandler);
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
        openImageUploadModal={openImageUploadModal}
        onInsertImage={handleInsertImage}
        handleImageUpload={handleImageUpload}
        images={uploadedImages}
        setImages={setUploadedImages}
      />
    </>
  );
};

Editor.displayName = "Editor";

export default Editor;

import React, { useCallback, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { formats, modules, REDO_ICON, UNDO_ICON } from "@/utils/blog-editor";
import { EditorProps } from "@/typings/interfaces";

const Editor = ({ value, onChange, handleImageUpload }: EditorProps) => {
  const editorRef = useRef<ReactQuill>(null);

  let icons = Quill.import("ui/icons");
  icons["undo"] = UNDO_ICON;
  icons["redo"] = REDO_ICON;

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
          const url = await handleImageUpload(file);
          if (editorRef && "current" in editorRef && editorRef.current) {
            const quill = editorRef.current.getEditor();
            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", url);
              quill.setSelection(range.index + 1, 1);
            }
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  }, [handleImageUpload, editorRef]);

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
      toolbar.addHandler("image", imageHandler);
      toolbar.addHandler("undo", undoHandler);
      toolbar.addHandler("redu", redoHandler);
    }
  }, [imageHandler, undoHandler, redoHandler]);

  return (
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
            image: imageHandler,
            undo: undoHandler,
            redo: redoHandler,
          },
        },
      }}
    />
  );
};

Editor.displayName = "Editor";

export default Editor;

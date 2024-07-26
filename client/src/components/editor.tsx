import React, { useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import { formats } from "@/utils/blog-editor";
import { EditorProps } from "@/typings/interfaces";

const Editor = ({ value, onChange, handleImageUpload }: EditorProps) => {
  const editorRef = useRef<ReactQuill | null>(null);

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

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          [{ font: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  return (
    <ReactQuill
      key="quil-editor"
      ref={editorRef}
      className="h-screen w-full"
      formats={formats}
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

Editor.displayName = "Editor";

export default Editor;

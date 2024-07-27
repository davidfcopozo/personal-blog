import React, { useCallback, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { formats } from "@/utils/blog-editor";
import { EditorProps } from "@/typings/interfaces";

const Editor = ({ value, onChange, handleImageUpload }: EditorProps) => {
  const editorRef = useRef<ReactQuill>(null);

  let icons = Quill.import("ui/icons");
  icons[
    "undo"
  ] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-left ql-stroke"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>`;
  icons[
    "redo"
  ] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-right ql-stroke"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>`;

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
      history: { delay: 200, maxStack: 500, userOnly: true },
      toolbar: {
        container: [
          ["undo", "redo"],
          [
            { header: "1" },
            { header: "2" },
            { header: [1, 2, 3, 4, 5, 6, false] },
          ],
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
          undo: () => {
            if (editorRef && "current" in editorRef && editorRef.current) {
              const quillEditor = editorRef.current.getEditor();
              const history = quillEditor.getModule("history");
              return history.undo();
            }
          },
          redo: () => {
            if (editorRef && "current" in editorRef && editorRef.current) {
              const quillEditor = editorRef.current.getEditor();
              const history = quillEditor.getModule("history");
              return history.redo();
            }
          },
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

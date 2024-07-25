import React, { forwardRef, useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import { formats } from "@/utils/blog-editor";
import { EditorProps } from "@/typings/interfaces";

const Editor = forwardRef<ReactQuill | null, EditorProps>((props, ref) => {
  const { value, onChange, handleImageUpload } = props;

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
          const quill = (
            ref as React.RefObject<ReactQuill>
          ).current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", url);
            quill.setSelection(range.index, 1);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  }, [handleImageUpload, ref]);

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
      ref={ref}
      className="h-screen w-full"
      formats={formats}
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
});

export default Editor;

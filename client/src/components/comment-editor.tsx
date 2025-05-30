import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { setTitle } from "@/utils/blog-editor";
import { CommentEditorProps } from "@/typings/interfaces";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" } /* , { list: "bullet" } */],
    ["link"],
    /*  ["clean"], */
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  /* "bullet", */
  "link",
];

export default function CommentEditor({
  onSubmit,
  onCancel,
  placeholder,
  maxHeight = 300,
  showCancelButton,
  value: content,
  onChange,
  commentMutationStatus,
}: CommentEditorProps) {
  const textareaRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const toolbar = document.querySelector(".ql-toolbar") as HTMLElement;

    if (toolbar) {
      // Assign title attribute for each toolbar item
      modules.toolbar.forEach((group, index) => {
        setTitle(group, toolbar, index);
      });
    }
  }, []);

  useEffect(() => {
    const quillEditor = textareaRef.current;
    if (quillEditor) {
      const textarea = quillEditor.getEditor().root;
      // Reset height to auto to correctly calculate scroll height
      textarea.style.height = "auto";
      textarea.style.overflowY = "hidden";
      textarea.ariaPlaceholder = placeholder as string;

      // Calculate new height, cap at maxHeight
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
    }
  }, [content, maxHeight, placeholder]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
    }
  };

  return (
    <>
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground rounded-md">
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="bg-background text-foreground"
            ref={textareaRef}
            style={{
              maxHeight: `${maxHeight}px`,
              overflowY: "auto",
            }}
          />
        </div>
      </Card>
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && showCancelButton && (
          <Button variant="outline" onClick={onCancel} className="py-4">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          className="gap-2"
          disabled={commentMutationStatus === "pending"}
        >
          <Send className="w-4 h-4" />
          Submit
        </Button>
      </div>
    </>
  );
}

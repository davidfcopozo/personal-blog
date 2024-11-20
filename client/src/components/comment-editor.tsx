import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  maxHeight?: number;
}

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
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
  "bullet",
  "link",
];

export default function CommentEditor({
  onSubmit,
  onCancel,
  placeholder = "Write your comment...",
  maxHeight = 300,
}: CommentEditorProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<ReactQuill>(null);
  useEffect(() => {
    const quillEditor = textareaRef.current;
    if (quillEditor) {
      const textarea = quillEditor.getEditor().root;
      // Reset height to auto to correctly calculate scroll height
      textarea.style.height = "auto";
      textarea.style.overflowY = "hidden";

      // Calculate new height, cap at maxHeight
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
    }
  }, [content, maxHeight]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto pb-4">
      <div className="mb-4">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-background text-foreground rounded-md"
          ref={textareaRef}
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="w-4 h-4" />
          Submit
        </Button>
      </div>
    </Card>
  );
}

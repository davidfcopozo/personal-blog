import { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { setTitle } from "@/utils/blog-editor";
import { CommentEditorProps } from "@/typings/interfaces";
import hljs from "highlight.js";

const modules = {
  syntax: true,
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
  "list",
  "code-block",
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

  useEffect(() => {
    if (typeof window !== "undefined" && textareaRef.current) {
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
      const editor = textareaRef.current.getEditor();

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
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground rounded-md">
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onChange}
            modules={modules}
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

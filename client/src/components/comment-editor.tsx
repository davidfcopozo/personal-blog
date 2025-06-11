"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { createLowlight } from "lowlight";

// Import common languages for syntax highlighting
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";

// Create lowlight instance
const lowlight = createLowlight();

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { CommentEditorProps } from "@/typings/interfaces";
import { useEffect } from "react";
import "@/styles/tiptap.css";

// Register languages with lowlight
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("json", json);
lowlight.register("bash", bash);
lowlight.register("sql", sql);

export default function CommentEditor({
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  maxHeight = 300,
  showCancelButton,
  value: content,
  onChange,
  commentMutationStatus,
}: CommentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3",
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const handleSubmit = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      // Check if there's actual content (not just empty tags)
      const textContent = editor.getText();
      if (textContent.trim()) {
        onSubmit(htmlContent);
      }
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleBlockquote = () =>
    editor?.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return (
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground rounded-md">
        <div className="p-4">
          <div className="min-h-[100px] flex items-center justify-center text-muted-foreground">
            Loading editor...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full mt-4 max-w-7xl border-[1px] border-muted-foreground rounded-md">
        <div className="border-b border-muted-foreground/20">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2">
            <Button
              type="button"
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="sm"
              onClick={toggleBold}
              className="h-8 w-8 p-0"
            >
              <span className="font-bold">B</span>
            </Button>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="sm"
              onClick={toggleItalic}
              className="h-8 w-8 p-0"
            >
              <span className="italic">I</span>
            </Button>
            <Button
              type="button"
              variant={editor.isActive("underline") ? "default" : "ghost"}
              size="sm"
              onClick={toggleUnderline}
              className="h-8 w-8 p-0"
            >
              <span className="underline">U</span>
            </Button>
            <Button
              type="button"
              variant={editor.isActive("strike") ? "default" : "ghost"}
              size="sm"
              onClick={toggleStrike}
              className="h-8 w-8 p-0"
            >
              <span className="line-through">S</span>
            </Button>
            <div className="w-px h-6 bg-muted-foreground/20 mx-1" />
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "default" : "ghost"}
              size="sm"
              onClick={toggleBlockquote}
              className="h-8 px-2"
            >
              Quote
            </Button>{" "}
            <Button
              type="button"
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className="h-8 px-2"
            >
              &lt;/&gt;
            </Button>
            <Button
              type="button"
              variant={editor.isActive("codeBlock") ? "default" : "ghost"}
              size="sm"
              onClick={toggleCodeBlock}
              className="h-8 px-2"
            >
              Code Block
            </Button>
            <div className="w-px h-6 bg-muted-foreground/20 mx-1" />
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="sm"
              onClick={toggleBulletList}
              className="h-8 px-2"
            >
              • List
            </Button>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              size="sm"
              onClick={toggleOrderedList}
              className="h-8 px-2"
            >
              1. List
            </Button>
            <div className="w-px h-6 bg-muted-foreground/20 mx-1" />
            <Button
              type="button"
              variant={editor.isActive("link") ? "default" : "ghost"}
              size="sm"
              onClick={setLink}
              className="h-8 px-2"
            >
              Link
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div
          className="relative"
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
        >
          <EditorContent
            editor={editor}
            className="bg-background text-foreground [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-3"
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

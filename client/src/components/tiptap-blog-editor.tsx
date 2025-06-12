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
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Youtube from "@tiptap/extension-youtube";
import { all, createLowlight } from "lowlight";
import { ResizableImage } from "tiptap-extension-resizable-image";

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
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import csharp from "highlight.js/lib/languages/csharp";
import c from "highlight.js/lib/languages/c";

// Create lowlight instance
const lowlight = createLowlight(all);

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BlogEditorToolbar from "./blog-editor-toolbar";
import { EditorProps } from "@/typings/interfaces";
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
lowlight.register("php", php);
lowlight.register("ruby", ruby);
lowlight.register("go", go);
lowlight.register("rust", rust);
lowlight.register("csharp", csharp);
lowlight.register("c", c);

interface TiptapBlogEditorProps extends EditorProps {
  className?: string;
}

export default function TiptapBlogEditor({
  value,
  onChange,
  handleImageUpload,
  onEditorReady,
  className = "",
}: TiptapBlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        heading: false, // We'll use custom Heading extension
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
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
      ResizableImage.configure({
        defaultWidth: 310,
        defaultHeight: 210,
        withCaption: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontFamily,
      Youtube.configure({
        controls: false,
        nocookie: true,
        modestBranding: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: () => {
      onEditorReady?.();
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);
  const addImage = async () => {
    if (handleImageUpload) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const url = await handleImageUpload(file);
            editor
              ?.chain()
              .focus()
              .setResizableImage({
                src: url,
                alt: file.name || "",
                title: file.name || "",
                width: 310,
                height: 210,
                "data-keep-ratio": true,
              })
              .run();
          } catch (error) {
            console.error("Failed to upload image:", error);
          }
        }
      };
      input.click();
    }
  };
  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addVideo = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) {
    return (
      <Card className={`w-full ${className}`}>
        <div className="p-6">
          <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
            Loading editor...
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className={`w-full ${className}`}>
      {/* Toolbar */}
      <BlogEditorToolbar
        editor={editor}
        onAddImage={addImage}
        onAddVideo={addVideo}
        onSetLink={setLink}
        onInsertTable={insertTable}
      />

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="bg-background text-foreground [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-6"
        />
      </div>
    </Card>
  );
}

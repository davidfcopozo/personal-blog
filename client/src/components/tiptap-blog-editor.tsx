"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
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
import { ResizableImage } from "tiptap-extension-resizable-image";
/* import { Extension } from "@tiptap/core"; */
import { languageDetectionPlugin } from "@/components/extensions/language-detection-plugin";

import { Card } from "@/components/ui/card";
import BlogEditorToolbar from "./blog-editor-toolbar";
import { EditorProps } from "@/typings/interfaces";
import { useEffect } from "react";
import "@/styles/tiptap.css";

// Import configurations from utils
import {
  createConfiguredLowlight,
  tiptapEditorConfig,
  extensionConfigs,
  defaultImageSettings,
  defaultTableSettings,
  createPromptDialog,
  validateImageFile,
  validateYouTubeUrl,
} from "@/utils/blog-editor";

// Create lowlight instance
const lowlight = createConfiguredLowlight();

// Language Detection Extension
const LanguageDetection = Extension.create({
  name: "languageDetection",

  addProseMirrorPlugins() {
    return [languageDetectionPlugin];
  },
});

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
      StarterKit.configure(extensionConfigs.starterKit),
      Heading.configure({
        ...extensionConfigs.heading,
        levels: [...extensionConfigs.heading.levels],
      }),
      CodeBlockLowlight.configure({
        lowlight,
        ...extensionConfigs.codeBlockLowlight,
      }),
      LanguageDetection,
      Underline,
      Link.configure(extensionConfigs.link),
      TextStyle,
      Color,
      Highlight.configure(extensionConfigs.highlight),
      ResizableImage.configure(extensionConfigs.resizableImage),
      Table.configure(extensionConfigs.table),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure(extensionConfigs.textAlign),
      FontFamily,
      Youtube.configure(extensionConfigs.youtube),
      Placeholder.configure({
        placeholder: extensionConfigs.placeholder.blog,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: () => {
      onEditorReady?.();
    },
    editorProps: tiptapEditorConfig.editorProps,
    immediatelyRender: tiptapEditorConfig.immediatelyRender,
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
        if (file && validateImageFile(file)) {
          try {
            const url = await handleImageUpload(file);
            editor
              ?.chain()
              .focus()
              .setResizableImage({
                src: url,
                alt: file.name || "",
                title: file.name || "",
                width: defaultImageSettings.width,
                height: defaultImageSettings.height,
                "data-keep-ratio": defaultImageSettings.keepRatio,
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
    const url = createPromptDialog("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addVideo = () => {
    const url = createPromptDialog("Enter YouTube URL:");
    if (url && validateYouTubeUrl(url)) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    } else if (url && !validateYouTubeUrl(url)) {
      alert("Please enter a valid YouTube URL");
    }
  };

  const insertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({
        rows: defaultTableSettings.rows,
        cols: defaultTableSettings.cols,
        withHeaderRow: defaultTableSettings.withHeaderRow,
      })
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

// Tiptap Blog Editor Configuration
import { all, createLowlight } from "lowlight";

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

// Create and configure lowlight instance
export const createConfiguredLowlight = () => {
  const lowlight = createLowlight(all);

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

  return lowlight;
};

// Tiptap editor configurations
export const tiptapEditorConfig = {
  editorProps: {
    attributes: {
      class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
    },
  },
  immediatelyRender: false,
};

// Tiptap extension configurations
export const extensionConfigs = {
  starterKit: {
    codeBlock: false as const, // We'll use CodeBlockLowlight instead
    heading: false as const, // We'll use custom Heading extension
  },
  heading: {
    levels: [1, 2, 3, 4, 5, 6] as const,
  },
  codeBlockLowlight: {
    defaultLanguage: "plaintext",
  },
  link: {
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline underline-offset-2 hover:text-primary/80",
    },
  },
  highlight: {
    multicolor: true,
  },
  resizableImage: {
    defaultWidth: 310,
    defaultHeight: 210,
    withCaption: true,
  },
  table: {
    resizable: true,
  },
  textAlign: {
    types: ["heading", "paragraph"],
  },
  youtube: {
    controls: false,
    nocookie: true,
    modestBranding: true,
  },
  placeholder: {
    blog: "Start writing your blog post...",
    comment: "Share your thoughts...",
  },
};

// Default image settings
export const defaultImageSettings = {
  width: 310,
  height: 210,
  keepRatio: true,
};

// Table insertion defaults
export const defaultTableSettings = {
  rows: 3,
  cols: 3,
  withHeaderRow: true,
};

// Editor helper functions
export const createPromptDialog = (
  message: string,
  defaultValue: string = ""
): string | null => {
  return window.prompt(message, defaultValue);
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
    return false;
  }

  if (file.size > maxSize) {
    alert("Image file size should be less than 10MB");
    return false;
  }

  return true;
};

export const validateYouTubeUrl = (url: string): boolean => {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
  return youtubeRegex.test(url);
};

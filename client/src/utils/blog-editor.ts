// Tiptap Blog Editor Configuration
import { all, createLowlight } from "lowlight";

// Import common languages for syntax highlighting
import javascript from "highlight.js/lib/languages/javascript";
// ...existing imports...
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

// Language detection utility
export const detectLanguageFromCode = (code: string): string => {
  if (!code || code.trim().length === 0) return "plaintext";

  // Check for common patterns to improve detection accuracy
  const trimmedCode = code.trim();

  // HTML detection
  if (
    trimmedCode.includes("<!DOCTYPE") ||
    (trimmedCode.includes("<") &&
      trimmedCode.includes(">") &&
      trimmedCode.includes("</"))
  ) {
    return "html";
  }

  // CSS detection
  if (
    trimmedCode.includes("{") &&
    trimmedCode.includes("}") &&
    (trimmedCode.includes(":") || trimmedCode.includes("@"))
  ) {
    return "css";
  }

  // JSON detection
  if (
    (trimmedCode.startsWith("{") && trimmedCode.endsWith("}")) ||
    (trimmedCode.startsWith("[") && trimmedCode.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch (e) {
      // Not valid JSON, continue with other detection
    }
  }
  // Shell/Bash detection
  if (
    trimmedCode.startsWith("#!") ||
    /^#!(\/bin\/bash|\/bin\/sh|\/usr\/bin\/env)/.test(trimmedCode)
  ) {
    return "bash";
  }

  // TypeScript detection (before JavaScript)
  if (
    trimmedCode.includes("interface ") ||
    trimmedCode.includes("type ") ||
    trimmedCode.includes(": string") ||
    trimmedCode.includes(": number") ||
    trimmedCode.includes(": boolean") ||
    trimmedCode.includes("enum ") ||
    trimmedCode.includes("implements ")
  ) {
    return "typescript";
  }

  // JavaScript detection
  if (
    trimmedCode.includes("function ") ||
    trimmedCode.includes("const ") ||
    trimmedCode.includes("let ") ||
    trimmedCode.includes("var ") ||
    trimmedCode.includes("=>") ||
    trimmedCode.includes("console.log") ||
    trimmedCode.includes("require(") ||
    trimmedCode.includes("import ") ||
    trimmedCode.includes("export ")
  ) {
    return "javascript";
  }

  // Python detection
  if (
    trimmedCode.includes("def ") ||
    trimmedCode.includes("import ") ||
    trimmedCode.includes("from ") ||
    trimmedCode.includes("print(") ||
    trimmedCode.includes("class ") ||
    /^[ ]*if __name__ == ['""]__main__['""]/.test(trimmedCode)
  ) {
    return "python";
  }

  // Java detection
  if (
    trimmedCode.includes("public class ") ||
    trimmedCode.includes("private ") ||
    trimmedCode.includes("public static void main") ||
    trimmedCode.includes("System.out.println")
  ) {
    return "java";
  }

  // C++ detection
  if (
    trimmedCode.includes("#include") ||
    trimmedCode.includes("std::") ||
    trimmedCode.includes("cout <<") ||
    trimmedCode.includes("cin >>") ||
    trimmedCode.includes("namespace ")
  ) {
    return "cpp";
  }

  // C# detection
  if (
    trimmedCode.includes("using System") ||
    trimmedCode.includes("namespace ") ||
    trimmedCode.includes("Console.WriteLine") ||
    trimmedCode.includes("public class ") ||
    (trimmedCode.includes("[") && trimmedCode.includes("]"))
  ) {
    return "csharp";
  }

  // PHP detection
  if (
    trimmedCode.startsWith("<?php") ||
    trimmedCode.includes("<?php") ||
    (trimmedCode.includes("$") &&
      (trimmedCode.includes("echo ") || trimmedCode.includes("print ")))
  ) {
    return "php";
  }

  // SQL detection
  if (
    /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(trimmedCode)
  ) {
    return "sql";
  }

  // Use highlight.js as fallback for other languages
  if (typeof window !== "undefined") {
    try {
      const hljs = require("highlight.js");
      const result = hljs.highlightAuto(trimmedCode, [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "c",
        "csharp",
        "php",
        "ruby",
        "go",
        "rust",
        "html",
        "css",
        "json",
        "sql",
        "bash",
        "shell",
        "xml",
        "yaml",
        "dockerfile",
        "markdown",
      ]);

      // Only return detected language if confidence is reasonable
      if (result.language && result.relevance > 5) {
        return result.language;
      }
    } catch (error) {
      console.warn("Language detection failed:", error);
    }
  }

  return "plaintext";
};

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
    strike: {
      HTMLAttributes: {
        class: "strikethrough",
      },
    },
  },
  heading: {
    levels: [1, 2, 3, 4, 5, 6] as const,
  },
  codeBlockLowlight: {
    defaultLanguage: "plaintext",
    languageClassPrefix: "language-",
    HTMLAttributes: {
      class: "code-block-wrapper",
    },
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
    resizable: true,  },
  textAlign: {
    types: ["heading", "paragraph"],
  },
  youtube: {
    controls: true,
    nocookie: false,
    modestBranding: false,
    width: 640,
    height: 480,
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
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)[\w-]+(&\S*)?$/;
  return youtubeRegex.test(url);
};

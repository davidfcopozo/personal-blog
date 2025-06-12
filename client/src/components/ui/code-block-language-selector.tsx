import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Code, ChevronDown } from "lucide-react";

// List of supported languages
export const SUPPORTED_LANGUAGES = [
  { value: "plaintext", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "dockerfile", label: "Dockerfile" },
  { value: "markdown", label: "Markdown" },
];

interface CodeBlockLanguageSelectorProps {
  editor: Editor;
  currentLanguage?: string;
}

export const CodeBlockLanguageSelector: React.FC<
  CodeBlockLanguageSelectorProps
> = ({ editor, currentLanguage = "plaintext" }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    // Update the current code block's language
    editor.chain().focus().updateAttributes("codeBlock", { language }).run();
  };

  const getCurrentLanguageLabel = () => {
    const language = SUPPORTED_LANGUAGES.find(
      (lang) => lang.value === selectedLanguage
    );
    return language?.label || "Plain Text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          title="Select Language"
        >
          <Code className="h-3 w-3 mr-1" />
          {getCurrentLanguageLabel()}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 max-h-64 overflow-y-auto"
      >
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => handleLanguageChange(language.value)}
            className={selectedLanguage === language.value ? "bg-accent" : ""}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Auto-detect language utility function
export const detectLanguage = (code: string): string => {
  if (!code || code.trim().length === 0) return "plaintext";

  // Import hljs dynamically to avoid SSR issues
  if (typeof window === "undefined") return "plaintext";

  try {
    // Use highlight.js for language detection
    const hljs = require("highlight.js");
    const result = hljs.highlightAuto(
      code.trim(),
      SUPPORTED_LANGUAGES.map((l) => l.value)
    );
    return result.language || "plaintext";
  } catch (error) {
    console.warn("Language detection failed:", error);
    return "plaintext";
  }
};

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
import { Code, ChevronDown, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "./code-block-language-selector";
import { detectLanguageFromCode } from "@/utils/blog-editor";

interface CodeBlockButtonProps {
  editor: Editor;
}

export const CodeBlockButton: React.FC<CodeBlockButtonProps> = ({ editor }) => {
  const [isCodeBlockActive, setIsCodeBlockActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("plaintext");

  useEffect(() => {
    const updateState = () => {
      const active = editor.isActive("codeBlock");
      setIsCodeBlockActive(active);

      if (active) {
        const attrs = editor.getAttributes("codeBlock");
        setCurrentLanguage(attrs.language || "plaintext");
      }
    };

    updateState();
    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  const insertCodeBlock = (language = "plaintext") => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  const insertCodeBlockWithDetection = () => {
    // Get selected text or clipboard content for detection
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (selectedText.trim()) {
      const detectedLanguage = detectLanguageFromCode(selectedText);
      insertCodeBlock(
        detectedLanguage !== "plaintext" ? detectedLanguage : "plaintext"
      );
    } else {
      // Try to read from clipboard if available
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard
          .readText()
          .then((clipboardText) => {
            if (clipboardText.trim()) {
              const detectedLanguage = detectLanguageFromCode(clipboardText);
              insertCodeBlock(
                detectedLanguage !== "plaintext"
                  ? detectedLanguage
                  : "plaintext"
              );
            } else {
              insertCodeBlock("plaintext");
            }
          })
          .catch(() => {
            // Fallback if clipboard access fails
            insertCodeBlock("plaintext");
          });
      } else {
        insertCodeBlock("plaintext");
      }
    }
  };

  const updateLanguage = (language: string) => {
    if (isCodeBlockActive) {
      editor.chain().focus().updateAttributes("codeBlock", { language }).run();
    }
  };

  const getCurrentLanguageLabel = () => {
    const language = SUPPORTED_LANGUAGES.find(
      (lang) => lang.value === currentLanguage
    );
    return language?.label || "Plain Text";
  };

  if (isCodeBlockActive) {
    // Show language selector when code block is active
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="h-8 px-2 text-xs"
            title={`Code Block (${getCurrentLanguageLabel()})`}
          >
            <Code className="h-4 w-4 mr-1" />
            {getCurrentLanguageLabel()}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 max-h-64 overflow-y-auto"
        >
          <DropdownMenuLabel>Change Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.value}
              onClick={() => updateLanguage(language.value)}
              className={currentLanguage === language.value ? "bg-accent" : ""}
            >
              {language.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show insert options when code block is not active
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Insert Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Insert Code Block</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={insertCodeBlockWithDetection}>
          <Sparkles className="h-4 w-4 mr-2" />
          Auto-detect Language
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => insertCodeBlock("plaintext")}>
          <Code className="h-4 w-4 mr-2" />
          Plain Text
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Popular Languages
        </DropdownMenuLabel>

        {SUPPORTED_LANGUAGES.slice(1, 8).map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => insertCodeBlock(language.value)}
            className="text-sm"
          >
            {language.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          All Languages
        </DropdownMenuLabel>

        {SUPPORTED_LANGUAGES.slice(8).map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => insertCodeBlock(language.value)}
            className="text-sm"
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

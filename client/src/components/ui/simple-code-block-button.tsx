import React from "react";
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

interface SimpleCodeBlockButtonProps {
  editor: Editor;
}

export const SimpleCodeBlockButton: React.FC<SimpleCodeBlockButtonProps> = ({
  editor,
}) => {
  const insertCodeBlock = (language = "plaintext") => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  const insertCodeBlockWithDetection = () => {
    // Get selected text for detection
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (selectedText.trim()) {
      const detectedLanguage = detectLanguageFromCode(selectedText);
      insertCodeBlock(
        detectedLanguage !== "plaintext" ? detectedLanguage : "plaintext"
      );
    } else {
      insertCodeBlock("plaintext");
    }
  };

  const isActive = editor.isActive("codeBlock");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className="h-8 px-2"
          title="Code Block"
        >
          <Code className="h-4 w-4 mr-1" />
          Code Block
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
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

        {SUPPORTED_LANGUAGES.slice(1, 6).map((language) => (
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

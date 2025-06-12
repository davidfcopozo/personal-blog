import { CodeBlockLowlight as BaseCodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import hljs from "highlight.js";

// List of supported languages for detection
const SUPPORTED_LANGUAGES = [
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
  "plaintext",
];

// Function to detect language from code content
function detectLanguage(code: string): string {
  if (!code || code.trim().length === 0) return "plaintext";

  try {
    const result = hljs.highlightAuto(code.trim(), SUPPORTED_LANGUAGES);
    return result.language || "plaintext";
  } catch (error) {
    console.warn("Language detection failed:", error);
    return "plaintext";
  }
}

export const CodeBlockLowlightWithDetection = BaseCodeBlockLowlight.extend({
  name: "codeBlock",

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "plaintext",
        parseHTML: (element) => {
          const { language } = element.dataset;
          return language || this.options.defaultLanguage;
        },
        renderHTML: (attributes) => {
          if (!attributes.language) {
            return {};
          }
          return {
            "data-language": attributes.language,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCodeBlockWithLanguage:
        (attributes = {}) =>
        ({ commands }: any) => {
          return commands.toggleNode(this.name, "paragraph", attributes);
        },
      updateCodeBlockLanguage:
        (language: string) =>
        ({ tr, state }: any) => {
          const { selection } = state;
          const { $from } = selection;

          // Find the code block node
          let codeBlockPos = null;
          let codeBlockNode = null;

          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === this.name) {
              codeBlockPos = $from.start(depth) - 1;
              codeBlockNode = node;
              break;
            }
          }

          if (codeBlockPos !== null && codeBlockNode) {
            tr.setNodeMarkup(codeBlockPos, undefined, {
              ...codeBlockNode.attrs,
              language,
            });
            return true;
          }

          return false;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // Auto-detect language when pasting content
      "Mod-Shift-v": () => {
        return this.editor.commands.command(({ tr, state }) => {
          // This will be handled by the paste event
          return false;
        });
      },
    };
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || [];

    // Add a plugin to handle language detection on content changes
    const languageDetectionPlugin = new Plugin({
      key: new PluginKey("languageDetection"),
      appendTransaction: (transactions, oldState, newState) => {
        const docChanged = transactions.some((tr) => tr.docChanged);
        if (!docChanged) return null;

        const tr = newState.tr;
        let modified = false;

        newState.doc.descendants((node, pos) => {
          if (node.type.name === this.name) {
            const content = node.textContent;
            const currentLanguage = node.attrs.language;

            // Only auto-detect if current language is plaintext or empty
            if (
              (!currentLanguage || currentLanguage === "plaintext") &&
              content.trim()
            ) {
              const detectedLanguage = detectLanguage(content);

              if (
                detectedLanguage !== "plaintext" &&
                detectedLanguage !== currentLanguage
              ) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  language: detectedLanguage,
                });
                modified = true;
              }
            }
          }
        });

        return modified ? tr : null;
      },
    });

    return [...plugins, languageDetectionPlugin];
  },
});

export { SUPPORTED_LANGUAGES };

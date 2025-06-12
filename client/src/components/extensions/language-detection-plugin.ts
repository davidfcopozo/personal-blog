import { Plugin, PluginKey } from "@tiptap/pm/state";
import { detectLanguageFromCode } from "@/utils/blog-editor";

export const languageDetectionPlugin = new Plugin({
  key: new PluginKey("languageDetection"),

  appendTransaction: (transactions, oldState, newState) => {
    const docChanged = transactions.some((tr) => tr.docChanged);
    if (!docChanged) return null;

    const tr = newState.tr;
    let modified = false;

    // Check all code blocks for language detection
    newState.doc.descendants((node, pos) => {
      if (node.type.name === "codeBlock") {
        const content = node.textContent;
        const currentLanguage = node.attrs.language;

        // Only auto-detect if current language is plaintext/empty and there's content
        if (
          (!currentLanguage || currentLanguage === "plaintext") &&
          content.trim()
        ) {
          const detectedLanguage = detectLanguageFromCode(content);

          // Only update if we detected a specific language (not plaintext)
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

  props: {
    handlePaste: (view, event, slice) => {
      // Handle paste events in code blocks
      const { state } = view;
      const { selection } = state;
      const { $from } = selection;

      // Check if we're pasting into a code block
      let codeBlockNode = null;
      let codeBlockPos = null;

      for (let depth = $from.depth; depth >= 0; depth--) {
        const node = $from.node(depth);
        if (node.type.name === "codeBlock") {
          codeBlockNode = node;
          codeBlockPos = $from.start(depth) - 1;
          break;
        }
      }

      if (codeBlockNode && codeBlockPos !== null) {
        // Get the pasted content
        const pastedText = slice.content.textBetween(0, slice.content.size);

        if (pastedText.trim()) {
          const currentLanguage = codeBlockNode.attrs.language;

          // Only auto-detect if current language is plaintext
          if (!currentLanguage || currentLanguage === "plaintext") {
            const detectedLanguage = detectLanguageFromCode(pastedText);

            if (detectedLanguage !== "plaintext") {
              // Update the code block language after a short delay to allow the paste to complete
              setTimeout(() => {
                const tr = view.state.tr;
                tr.setNodeMarkup(codeBlockPos, undefined, {
                  ...codeBlockNode.attrs,
                  language: detectedLanguage,
                });
                view.dispatch(tr);
              }, 100);
            }
          }
        }
      }

      return false; // Allow normal paste handling to continue
    },
  },
});

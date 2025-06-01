import { Quill } from "react-quill-new";

// Import the original CodeBlock format
const CodeBlock = Quill.import("formats/code-block") as any;

class CustomCodeBlock extends CodeBlock {
  static blotName = "code-block";
  static tagName = "PRE";
  static className = "ql-code-block-container";

  static create(value: any) {
    const node = document.createElement("PRE");
    node.className = "ql-code-block-container";
    node.setAttribute("spellcheck", "false");

    const codeElement = document.createElement("CODE");
    codeElement.className = "ql-code-block";
    node.appendChild(codeElement);

    return node;
  }

  static formats(domNode: HTMLElement) {
    return domNode.tagName === "PRE";
  }

  // Override the optimize method to ensure proper structure
  optimize(context: any) {
    super.optimize(context);

    // Ensure we always have the code element
    const codeElement = this.domNode.querySelector("code");
    if (!codeElement) {
      const code = document.createElement("CODE");
      code.className = "ql-code-block";

      // Move any existing text content to the code element
      while (this.domNode.firstChild && this.domNode.firstChild !== code) {
        code.appendChild(this.domNode.firstChild);
      }

      this.domNode.appendChild(code);
    }
  }

  // Handle text insertion - this is crucial for proper editing
  insertAt(index: number, value: string, def?: any) {
    const codeElement = this.domNode.querySelector("code");

    if (typeof value === "string" && codeElement) {
      // Insert text into the code element
      const textNodes = this.getTextNodes(codeElement);
      let currentIndex = 0;

      for (const textNode of textNodes) {
        const nodeLength = textNode.textContent?.length || 0;
        if (index <= currentIndex + nodeLength) {
          const relativeIndex = index - currentIndex;
          const currentText = textNode.textContent || "";
          const newText =
            currentText.slice(0, relativeIndex) +
            value +
            currentText.slice(relativeIndex);
          textNode.textContent = newText;
          return;
        }
        currentIndex += nodeLength;
      }

      // If we get here, append to the end
      if (textNodes.length === 0) {
        codeElement.appendChild(document.createTextNode(value));
      } else {
        const lastNode = textNodes[textNodes.length - 1];
        lastNode.textContent = (lastNode.textContent || "") + value;
      }
    } else {
      super.insertAt(index, value, def);
    }
  }

  // Handle text deletion
  deleteAt(index: number, length: number) {
    const codeElement = this.domNode.querySelector("code");

    if (codeElement) {
      const textNodes = this.getTextNodes(codeElement);
      let currentIndex = 0;

      for (const textNode of textNodes) {
        const nodeLength = textNode.textContent?.length || 0;

        if (index < currentIndex + nodeLength) {
          const relativeIndex = index - currentIndex;
          const currentText = textNode.textContent || "";
          const endIndex = Math.min(relativeIndex + length, nodeLength);
          const newText =
            currentText.slice(0, relativeIndex) + currentText.slice(endIndex);
          textNode.textContent = newText;

          // Update remaining length to delete
          length -= endIndex - relativeIndex;
          if (length <= 0) break;
        }

        currentIndex += nodeLength;
      }
    }
  }

  // Get all text nodes within the code element
  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // If no text nodes exist, create one
    if (textNodes.length === 0) {
      const textNode = document.createTextNode("");
      element.appendChild(textNode);
      textNodes.push(textNode);
    }

    return textNodes;
  }

  // Calculate total length
  length() {
    const codeElement = this.domNode.querySelector("code");
    return (codeElement?.textContent?.length || 0) + 1; // +1 for the newline
  }

  // Get the text value
  value() {
    const codeElement = this.domNode.querySelector("code");
    return codeElement?.textContent || "";
  }

  // Handle positioning for cursor placement
  position(index: number, inclusive = false): [Node, number] {
    const codeElement = this.domNode.querySelector("code");
    if (codeElement) {
      const textNodes = this.getTextNodes(codeElement);
      let currentIndex = 0;

      for (const textNode of textNodes) {
        const nodeLength = textNode.textContent?.length || 0;
        if (index <= currentIndex + nodeLength) {
          return [textNode, index - currentIndex];
        }
        currentIndex += nodeLength;
      }

      // Return the last position
      if (textNodes.length > 0) {
        const lastNode = textNodes[textNodes.length - 1];
        return [lastNode, lastNode.textContent?.length || 0];
      }
    }

    return [this.domNode, 0];
  }

  // Handle index calculation
  index(node: Node, offset: number): number {
    const codeElement = this.domNode.querySelector("code");
    if (codeElement && (codeElement === node || codeElement.contains(node))) {
      const textNodes = this.getTextNodes(codeElement);
      let totalIndex = 0;

      for (const textNode of textNodes) {
        if (textNode === node) {
          return totalIndex + offset;
        }
        totalIndex += textNode.textContent?.length || 0;
      }
    }

    return 0;
  }
}

// Register the custom code block, overriding the original
Quill.register("formats/code-block", CustomCodeBlock, true);

export default CustomCodeBlock;

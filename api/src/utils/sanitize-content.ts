import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const dompurifyConfig = {
  ALLOWED_TAGS: [
    "a",
    "b",
    "i",
    "em",
    "strong",
    "u",
    "ul",
    "ol",
    "li",
    "p",
    "br",
    "span",
    "blockquote",
    "code",
    "pre",
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "alt",
    "title",
    "src",
    "class",
    "data-language",
    "spellcheck",
  ],
  ALLOW_DATA_ATTR: false, // Prevent data-* attributes unless explicitly needed
  FORBID_TAGS: ["script", "iframe", "object", "embed", "style"], // Explicitly forbid script and style tags
  FORBID_ATTR: ["on*", "style"], // Prevent event handler attributes
  ADD_ATTR: ["rel"], // Add rel attribute for links
  /* ADD_TAGS: [], */ // Add custom tags if needed (e.g., embeds)
  RETURN_DOM: false, // Return HTML string
  RETURN_DOM_FRAGMENT: false, // Return string, not fragment
  KEEP_CONTENT: true, // Preserve inner content
};

export const sanitizeContent = (dirtyHtml: string) => {
  return DOMPurify.sanitize(dirtyHtml, dompurifyConfig);
};

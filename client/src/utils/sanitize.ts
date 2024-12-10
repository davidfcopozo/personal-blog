import DOMPurify from "dompurify";

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
  ALLOWED_ATTR: ["href", "target", "alt", "title", "src", "class"],
  ALLOW_DATA_ATTR: false, // Prevent data-* attributes unless explicitly needed
  FORBID_TAGS: ["script", "iframe", "object", "embed", "style"], // Explicitly forbid script and style tags
  FORBID_ATTR: ["on*", "style"], // Prevent event handler attributes
  ADD_ATTR: ["rel"], // Add rel attribute for links
  /* ADD_TAGS: [], */ // Add custom tags if needed (e.g., embeds)
  KEEP_CONTENT: false, // Remove the entire tag if forbidden (don't keep inner content)
  RETURN_DOM: false, // Return HTML string instead of DOM nodes
  RETURN_DOM_FRAGMENT: false, // Don't use DOMFragment (not necessary for Next.js)
};

export const sanitizeContent = (dirtyHtml: string) => {
  return DOMPurify.sanitize(dirtyHtml, dompurifyConfig);
};

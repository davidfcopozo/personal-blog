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
    "s", // Allow strikethrough
    "del", // Allow deleted text
    "div", // Allow div for YouTube videos
    "iframe", // Allow iframe for YouTube videos
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
  ],ALLOWED_ATTR: [
    "href",
    "target",
    "alt",
    "title",
    "src",
    "class",
    "data-language",
    "data-youtube-video", // Allow YouTube video data attribute
    "data-keep-ratio", // Allow image ratio data attribute
    "data-src", // TipTap YouTube extension uses this
    "data-start", // YouTube start time
    "data-end", // YouTube end time
    "data-aspect-ratio", // YouTube aspect ratio
    "spellcheck",
    "width",
    "height",
    "frameborder",
    "allowfullscreen",
    "allow",
    "style", // Allow style for width/height of videos
    "loading", // For iframe loading attribute
    "referrerpolicy", // For iframe security
    "contenteditable", // Allow contenteditable for Tiptap
    "draggable", // Allow draggable for Tiptap
    "autoplay", // YouTube iframe attributes
    "disablekbcontrols", // YouTube iframe attributes
    "enableiframeapi", // YouTube iframe attributes
    "endtime", // YouTube iframe attributes
    "ivloadpolicy", // YouTube iframe attributes
    "loop", // YouTube iframe attributes
    "modestbranding", // YouTube iframe attributes
    "origin", // YouTube iframe attributes
    "playlist", // YouTube iframe attributes
    "rel", // YouTube iframe attributes
    "start", // YouTube iframe attributes
  ],  ALLOW_DATA_ATTR: true, // Allow data-* attributes for video embeds
  FORBID_TAGS: ["script", "object", "embed", "style"], // Remove iframe from forbidden tags
  FORBID_ATTR: ["on*"], // Remove style from forbidden attributes - allow style for video dimensions
  ADD_ATTR: ["rel"], // Add rel attribute for links
  /* ADD_TAGS: [], */ // Add custom tags if needed (e.g., embeds)
  RETURN_DOM: false, // Return HTML string
  RETURN_DOM_FRAGMENT: false, // Return string, not fragment
  KEEP_CONTENT: true, // Preserve inner content
  // Allow YouTube iframe URLs only
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

export const sanitizeContent = (dirtyHtml: string) => {
  return DOMPurify.sanitize(dirtyHtml, dompurifyConfig);
};

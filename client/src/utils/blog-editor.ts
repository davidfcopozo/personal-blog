import { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align",
  "font",
  "script",
  "color",
  "background",
  "link",
  "image",
  "clean",
  "video",
  "code-block",
];

export const modules = {
  history: { delay: 200, maxStack: 500, userOnly: true },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
  toolbar: {
    container: [
      ["undo", "redo"],
      [{ header: "1" }, { header: "2" }, { header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [{ font: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],

      ["clean"],
    ],
    syntax: true,
  },
  clipboard: {
    matchVisual: false,
  },
};

export const UNDO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-left ql-stroke"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>`;
export const REDO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-right ql-stroke"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>`;

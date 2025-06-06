import dynamic from "next/dynamic";
import { Quill } from "react-quill-new";
const ImageResize = dynamic(() => import("quill-image-resize-module-react"), {
  ssr: false,
});

Quill.register("modules/imageResize", ImageResize);

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  /* "bullet", */
  "indent",
  "align",
  "font",
  "script",
  "color",
  "background",
  "link",
  "image",
  /*   "clean", */
  "video",
  "code-block",
];

export const modules = {
  syntax: true,
  history: { delay: 200, maxStack: 500, userOnly: true },
  imageResize: {
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
  },
  clipboard: {
    matchVisual: false,
  },
};

const toolbarOptionLabels = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strike: "Strike through",
  blockquote: "Blockquote",
  "code-block": "Code block",
  link: "Link",
  image: "Image",
  video: "Video",
  formula: "Formula",
  header: "Header",
  list: "List",
  script: "Script",
  indent: "Indent",
  direction: "Text direction",
  size: "Text size",
  color: "Text color",
  background: "Bankground color",
  font: "Font style",
  align: "Align text",
  /* clean: "Remove all formatting", */
};

export const setTitle = (
  menu: any,
  toolbarGroup: HTMLElement,
  objIndex: number = 0
) => {
  if (Array.isArray(menu)) {
    // Recursively handle array items
    menu.forEach((item, index) => {
      setTitle(item, toolbarGroup, index);
    });
  } else if (typeof menu === "object") {
    // Handle toolbar object items (e.g., { list: "ordered" })
    Object.keys(menu).forEach((key) => {
      const value = menu[key];
      const title =
        toolbarOptionLabels[key as keyof typeof toolbarOptionLabels] ||
        key.charAt(0).toUpperCase() + key.slice(1);
      const elements = toolbarGroup.querySelectorAll(`.ql-${key}`);
      if (elements[objIndex]) {
        elements[objIndex].setAttribute(
          "title",
          Array.isArray(value)
            ? `${title} ${value.join(", ")}`
            : `${title} ${value}`
        );
      }
    });
  } else {
    // Handle direct string items (e.g., "bold")
    const title =
      toolbarOptionLabels[menu as keyof typeof toolbarOptionLabels] || menu;
    const element = toolbarGroup.querySelector(`.ql-${menu}`);
    if (element) {
      element.setAttribute("title", title);
    }
  }
};

export const UNDO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-left ql-stroke"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>`;
export const REDO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-up-right ql-stroke"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>`;

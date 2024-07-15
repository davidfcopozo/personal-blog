import {
  DeleteImageFromFirebaseType,
  ExtractImagesFromContentType,
} from "@/typings/types";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { ExtendedEditor } from "@/typings/interfaces";

export const extractImagesFromContent: ExtractImagesFromContentType = (
  content
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));
  return images.map((img) => img.src);
};

export const editorColors = {
  dark: {
    "--editor-bg-color": "#030712 ",
    "--editor-toolbar-bg-color": "#030712",
    "--editor-content-bg-color": "#030712",
    "--editor-text-color": "#cccccc",
    "--editor-icon-color": "#ffffff",
    "--editor-btn-hover-color": "#3e3e3e",
    "--editor-border-color": "#555555",
    "--editor-header-bg-color": "#030712",
  },
  light: {
    "--editor-bg-color": "#ffffff",
    "--editor-header-color": "#000000",
    "--editor-toolbar-bg-color": "#f0f0f0",
    "--editor-content-bg-color": "#fafafa",
    "--editor-text-color": "#333333",
    "--editor-icon-color": "#000000",
    "--editor-btn-hover-color": "#e0e0e0",
    "--editor-border-color": "#cccccc",
    "--editor-header-bg-color": "#f5f5f5",
  },
};

export const deleteImageFromFirebase: DeleteImageFromFirebaseType = async (
  imageUrl
) => {
  try {
    const imagePath = imageUrl.split("images%2F")[1]?.split("?")[0];
    const imageRef = ref(storage, `images/${imagePath}`);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export   const updateEditorTheme = (editor: ExtendedEditor, theme: any) => {
  if (!editor) return;

  const dom = editor.dom;
  const body = editor.getBody();

  // Update content area
  dom.setStyle(body, "background-color", theme["--editor-content-bg-color"]);
  dom.setStyle(body, "color", theme["--editor-text-color"]);

  // Update iframe background
  const iframe = editor.iframeElement;
  if (iframe) {
    dom.setStyle(
      iframe,
      "background-color",
      theme["--editor-content-bg-color"]
    );
  }

  // Add custom styles
  const styleId = "tiny-custom-styles";
  let styleElm = dom.get(styleId);
  if (!styleElm) {
    styleElm = dom.create("style", { id: styleId });
    dom.getRoot().parentNode?.appendChild(styleElm);
  }

  const css = `
    body {
      background-color: ${theme["--editor-content-bg-color"]} !important;
      color: ${theme["--editor-text-color"]} !important;
    }
  `;

  if (styleElm.firstChild) {
    styleElm.firstChild.textContent = css;
  } else {
    styleElm.appendChild(dom.create("textnode", {}, css));
  }

  // Force refresh
  editor.fire("ResizeEditor");
};
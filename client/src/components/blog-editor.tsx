import { useState, useRef, useEffect } from "react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Editor as TinyMCEEditor } from "tinymce";
import { BlogEditorProps } from "@/typings/interfaces";
  useEffect(() => {
    const initialImages = extractImagesFromContent(initialValue || "");
    setCurrentImages(initialImages);
  }, [initialValue]);

  const extractImagesFromContent = (content: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));
    return images.map((img) => img.src);
  };


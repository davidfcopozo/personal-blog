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

  const deleteImageFromFirebase = async (imageUrl: string) => {
    try {
      const imagePath = imageUrl.split("images%2F")[1].split("?")[0];
      const imageRef = ref(storage, `images/${imagePath}`);
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEditorChange: IAllProps["onEditorChange"] = (
    newContent,
    editor
  ) => {
    setContent(newContent);
    // Get all image URLs in the current content
    const contentImages = extractImagesFromContent(newContent);

    const removedImages = currentImages.filter(
      (img) => !contentImages.includes(img)
    );

    if (removedImages.length > 0) {
      removedImages.forEach(deleteImageFromFirebase);
      setCurrentImages(contentImages);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      onSave({
        title,
        content: (editorRef.current as TinyMCEEditor).getContent(),
      });
    }
  };

  const handleImageUpload = async (
    blobInfo: any,
    progress: (percent: number) => void
  ) => {
    try {
      const file = blobInfo.blob();
      const fileName = blobInfo.name();
      const storageRef = ref(storage, `images/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setCurrentImages((prev) => [...prev, downloadURL]);
      return downloadURL;
    } catch (error: Error | any) {
      throw new Error("Image upload failed: " + error.message);
    }
  };


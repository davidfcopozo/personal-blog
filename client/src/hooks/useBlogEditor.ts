import { IAllProps } from "@tinymce/tinymce-react";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Editor as TinyMCEEditor } from "tinymce";
import { ExtendedEditor, UseBlogEditorProps } from "@/typings/interfaces";
import "@/styles/tinyCME-styles.css";
import { useToast } from "@/components/ui/use-toast";

export const useBlogEditor = ({
  title,
  content,
  setContent,
  currentImages,
  setCurrentImages,
  editorRef,
  onSave,
}: UseBlogEditorProps) => {
  const { toast } = useToast();

  const extractImagesFromContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));
    return images.map((img) => img.src);
  };

  const deleteImageFromFirebase = async (imageUrl: string) => {
    try {
      const imagePath = imageUrl.split("images%2F")[1]?.split("?")[0];
      const imageRef = ref(storage, `images/${imagePath}`);
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const updateEditorTheme = (editor: ExtendedEditor, theme: any) => {
    if (!editor) return;

    const dom = editor.dom;
    const body = editor.getBody();

    dom.setStyle(body, "background-color", theme["--editor-content-bg-color"]);
    dom.setStyle(body, "color", theme["--editor-text-color"]);

    const iframe = editor.iframeElement;
    if (iframe) {
      dom.setStyle(
        iframe,
        "background-color",
        theme["--editor-content-bg-color"]
      );
    }

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

    editor.fire("ResizeEditor");
  };

  const handleEditorChange: IAllProps["onEditorChange"] = (
    newContent,
    editor
  ) => {
    setContent(newContent);
    const contentImages = extractImagesFromContent(newContent);

    const firebaseImages = contentImages.filter((url) =>
      url.includes("firebasestorage.googleapis.com")
    );

    const removedImages = currentImages.filter(
      (img) =>
        !firebaseImages.includes(img) &&
        img.includes("firebasestorage.googleapis.com")
    );

    if (removedImages.length > 0) {
      removedImages.forEach(deleteImageFromFirebase);
      setCurrentImages(contentImages);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return toast({
        variant: "destructive",
        title: "Blog Post Failed",
        description: "Please enter a title for the blog post.",
      });
    }

    if (!content) {
      return toast({
        variant: "destructive",
        title: "Blog Post Failed",
        description: "Please enter content for the blog post.",
      });
    }
    if (editorRef.current) {
      onSave(e, {
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
      const downloadURL: string = await getDownloadURL(snapshot.ref);
      const newImages = [...currentImages, downloadURL];
      setCurrentImages(newImages);
      return downloadURL;
    } catch (error: Error | any) {
      throw new Error("Image upload failed: " + error.message);
    }
  };

  const handleFilePicker = (
    cb: (arg0: any, arg1: { title: string }) => void,
    value: any,
    meta: any
  ) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener("change", (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const id = `${file.name.split(".")[0]}-${Date.now()}`;
        const blobCache = editorRef.current?.editorUpload.blobCache;
        const base64 = (reader.result as string)?.split(",")[1];
        const blobInfo = blobCache?.create(id, file, base64);
        blobCache?.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  };

  return {
    extractImagesFromContent,
    deleteImageFromFirebase,
    updateEditorTheme,
    handleEditorChange,
    handleSave,
    handleImageUpload,
    handleFilePicker,
  };
};

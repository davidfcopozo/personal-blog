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

export default function BlogEditor({ initialValue, onSave }: BlogEditorProps) {
  const [content, setContent] = useState(initialValue || "");
  const [title, setTitle] = useState("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

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
        const blobCache = editorRef.current.editorUpload.blobCache;
        // Get base64 string
        const base64 = (reader.result as string)?.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        // Call callback with blob URI
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    // Trigger input click event to open file picker
    input.click();
  };

  return (
    <div className="blog-editor">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter blog title"
        className="blog-title-input"
      />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        toolbar={true}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | image | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          images_upload_handler: handleImageUpload,
          file_picker_types: "image",
          automatic_uploads: true,
          file_picker_callback: handleFilePicker,
        }}
        onEditorChange={handleEditorChange}
      />
      <button onClick={handleSave} className="save-button">
        Save Blog Post
      </button>
    </div>
  );
}

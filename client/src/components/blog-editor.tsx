import { useState, useRef, useEffect } from "react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Editor as TinyMCEEditor } from "tinymce";
import { BlogEditorProps, ExtendedEditor } from "@/typings/interfaces";
import {
  deleteImageFromFirebase,
  extractImagesFromContent,
} from "@/utils/blog-editor";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import "@/styles/tinyCME-styles.css";
import { useTheme } from "next-themes";

export default function BlogEditor({ onSave }: BlogEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const colors = {
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
  const [darkTheme, setDarkTheme] = useState(colors.dark);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();
  const { theme, systemTheme } = useTheme();

  const updateEditorTheme = (editor: ExtendedEditor, theme: any) => {
    if (!editor) return;

    const dom = editor.dom;
    const body = editor.getBody();

    // Update content area
    dom.setStyle(body, "background-color", theme["--editor-content-bg-color"]);
    (dom as any).setStyle(
      body as unknown as string,
      "color",
      theme["--editor-content-text-color"]
    );

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
        color: ${theme["--editor-content-text-color"]} !important;
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
  useEffect(() => {
    const newTheme =
      theme === "dark" || (theme !== "light" && systemTheme === "dark")
        ? colors.dark
        : colors.light;
    setDarkTheme(newTheme);
  }, [theme, systemTheme]);

  useEffect(() => {
    if (editorRef.current) {
      updateEditorTheme(editorRef.current, darkTheme);
    }
  }, [darkTheme]);

  useEffect(() => {
    const initialImages = extractImagesFromContent(content);
    setCurrentImages(initialImages);
  }, [content]);

  const handleEditorChange: IAllProps["onEditorChange"] = (
    newContent,
    editor
  ) => {
    setContent(newContent);
    const contentImages = extractImagesFromContent(newContent);

    // Filter out blob URIs from contentImages
    const firebaseImages = contentImages.filter((url) =>
      url.includes("firebasestorage.googleapis.com")
    );

    // Only consider Firebase URLs for removal
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

    input.click();
  };

  return (
    <div
      className="blog-editor px-4 bg-background"
      style={darkTheme as unknown as React.CSSProperties}
    >
      <div className="flex gap-4 px-2 mx-auto pb-4">
        <Input
          type="text"
          placeholder="Enter blog  title"
          className="text-2xl font-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-background"
            onClick={(e) => handleSave(e)}
          >
            Save Draft
          </Button>
          <Button className="bg-foreground" onClick={(e) => handleSave(e)}>
            Publish
          </Button>
        </div>
      </div>
      {/* 
      </div> */}
      <Editor
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        value={content}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        toolbar={true}
        init={{
          height: 500,
          menubar: true,
          /* content_css: "tinymce-5-dark", */
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
          setup: (editor) => {
            editorRef.current = editor;
            editor.on("init", () =>
              updateEditorTheme(editor as any, darkTheme)
            );
          },
          content_style: `
              body {
                font-family: Helvetica, Arial, sans-serif;
                font-size: 14px;
              }
            `,
          body_class: "mce-content-body",
          content_css: false, // Disable default content CSS
          images_upload_handler: handleImageUpload,
          file_picker_types: "image",
          automatic_uploads: true,
          file_picker_callback: handleFilePicker,
        }}
        onEditorChange={handleEditorChange}
      />
      {/*   <button onClick={(e) => handleSave(e)} className="save-button">
        Save Blog Post
      </button> */}
    </div>
  );
}

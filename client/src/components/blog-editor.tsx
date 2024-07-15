import { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BlogEditorProps } from "@/typings/interfaces";
import { editorColors } from "@/utils/blog-editor";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import "@/styles/tinyCME-styles.css";
import { useTheme } from "next-themes";
import EditorWrapper from "./editor-wrapper";
import BouncingCirclesLoader from "./bouncing-squares-loader";
import { useBlogEditor } from "@/hooks/useBlogEditor";

export default function BlogEditor({ onSave }: BlogEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [darkTheme, setDarkTheme] = useState(editorColors.dark);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const editorRef = useRef<any>(null);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const newTheme =
      theme === "dark" || (theme !== "light" && systemTheme === "dark")
        ? editorColors.dark
        : editorColors.light;
    setDarkTheme(newTheme);
    setIsThemeReady(true);
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

  const {
    extractImagesFromContent,
    updateEditorTheme,
    handleEditorChange,
    handleSave,
    handleImageUpload,
    handleFilePicker,
  } = useBlogEditor({
    title,
    content,
    setContent,
    currentImages,
    setCurrentImages,
    editorRef,
    onSave: onSave,
  });

  return (
    <div
      className="blog-editor px-4 bg-background"
      style={darkTheme as React.CSSProperties}
    >
      {!isEditorReady && <BouncingCirclesLoader />}
      <EditorWrapper isReady={isEditorReady && isThemeReady}>
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
        <Editor
          onInit={(evt, editor) => {
            editorRef.current = editor;
            setIsEditorReady(true);
          }}
          value={content}
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
              editor.on("init", () => {
                updateEditorTheme(editor as any, darkTheme);
                setTimeout(() => setIsEditorReady(true), 800);
              });
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
      </EditorWrapper>
    </div>
  );
}

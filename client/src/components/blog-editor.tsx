"use client";
import React, { FC, FormEvent, useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import "highlight.js/styles/github.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Categories from "./categories";
import Tags from "./tags";
import dynamic from "next/dynamic";
import { BlogEditorProps } from "@/typings/interfaces";
import QuillLoadingSkeleton from "./quill-loading-skeleton";
import { NewPostHeader } from "./new-post-header";
import { Skeleton } from "./ui/skeleton";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import csharp from "highlight.js/lib/languages/csharp";
import c from "highlight.js/lib/languages/c";

console.log(javascript);

const Editor = dynamic(
  () => {
    // Configure hljs globally before importing the editor
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.hljs = hljs;

      // Configure hljs with languages for better detection
      hljs.configure({
        languages: [
          "javascript",
          "typescript",
          "html",
          "css",
          "python",
          "java",
          "cpp",
          "json",
          "xml",
          "bash",
          "sql",
          "php",
          "ruby",
          "go",
          "rust",
          "csharp",
          "c",
        ],
      });

      // Register JavaScript the imported languges
      hljs.registerLanguage("javascript", javascript);
      hljs.registerLanguage("typescript", typescript);
      hljs.registerLanguage("html", html);
      hljs.registerLanguage("css", css);
      hljs.registerLanguage("python", python);
      hljs.registerLanguage("java", java);
      hljs.registerLanguage("cpp", cpp);
      hljs.registerLanguage("json", json);
      hljs.registerLanguage("xml", xml);
      hljs.registerLanguage("bash", bash);
      hljs.registerLanguage("sql", sql);
      hljs.registerLanguage("php", php);
      hljs.registerLanguage("ruby", ruby);
      hljs.registerLanguage("go", go);
      hljs.registerLanguage("rust", rust);
      hljs.registerLanguage("csharp", csharp);
      hljs.registerLanguage("c", c);
    }

    return import("./editor");
  },
  {
    ssr: false,
    loading: () => <QuillLoadingSkeleton />,
  }
);

const BlogEditor: FC<BlogEditorProps> = ({
  initialPost = null,
  slug = null,
  isPostLoading = false,
}) => {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  const handleSave = (e: FormEvent) => {
    handleSubmit(e);
  };

  const {
    temporaryFeatureImage,
    postData,
    updatePostState,
    handleSubmit,
    handleContentChange,
    handleImageUpload,
    handleFeatureImagePick,
  } = useBlogEditor({ initialPost, slug });

  const { title, content, featuredImage, tags, categories } = postData;

  useEffect(() => {
    if (initialPost) {
      updatePostState("title", initialPost.title || "");
      updatePostState("content", initialPost.content || "");
      updatePostState("featuredImage", initialPost.featuredImage || null);
      updatePostState("categories", initialPost.categories || []);
      updatePostState("tags", initialPost.tags || []);
    }
  }, [initialPost, updatePostState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEditorLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="outer-container">
      <NewPostHeader onSave={handleSave} />
      <main>
        <div className="flex-column md:flex">
          <div
            className={`mb-20 ${!isPostLoading && "p-4"} xs:mb-4 md:w-3/4  `}
          >
            <form onSubmit={handleSubmit}>
              {isEditorLoaded && !isPostLoading ? (
                <div className="mb-4">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => updatePostState("title", e.target.value)}
                    placeholder="Enter blog title"
                  />
                </div>
              ) : (
                <div className="border p-2 rounded-md mb-4 w-full">
                  <Skeleton className="h-6 w-3/4" />
                </div>
              )}
              <div className="mb-4">
                <Editor
                  value={content || (initialPost?.content as string)}
                  onChange={handleContentChange}
                  handleImageUpload={handleImageUpload}
                  onEditorReady={() => setIsEditorLoaded(true)}
                />
              </div>
            </form>
          </div>
          <div className="[&>*:nth-child(even)]:my-8 md:w-1/4 p-4">
            <FeatureImage
              imageUrl={featuredImage}
              temporaryFeatureImage={temporaryFeatureImage}
              onUpload={handleFeatureImagePick}
            />
            <Categories
              categories={categories}
              setCategories={(value) =>
                updatePostState(
                  "categories",
                  typeof value === "function" ? value(categories) : value
                )
              }
            />
            <Tags
              tags={tags}
              setTags={(value: string[] | ((prevTags: string[]) => string[])) =>
                updatePostState(
                  "tags",
                  typeof value === "function" ? value(tags) : value
                )
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogEditor;

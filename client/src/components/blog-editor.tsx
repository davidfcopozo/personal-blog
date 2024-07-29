"use client";
import React, { ComponentType, FormEvent, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Layout from "@/app/new-post/layout";
import Categories from "./categories";
import Tags from "./tags";
import { BouncingCircles } from "./icons";

const BlogEditor = () => {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [EditorComponent, setEditorComponent] =
    useState<ComponentType<any> | null>(null);

  const handleSave = (e: FormEvent) => {
    handleSubmit(e);
  };

  const {
    title,
    content,
    featureImage,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    setFeatureImage,
  } = useBlogEditor();

  useEffect(() => {
    const loadEditor = async () => {
      const EditorModule = await import("./editor");
      setEditorComponent(() => EditorModule.default);
      setIsEditorLoaded(true);
    };
    loadEditor();
  }, []);

  return (
    <Layout onSave={handleSave}>
      {!isEditorLoaded ? (
        <div className="flex items-center justify-center min-h-screen">
          <BouncingCircles />
        </div>
      ) : (
        <div className="flex-column md:flex">
          <div className="mb-20 xs:mb-4 md:w-3/4 p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter blog title"
                />
              </div>
              <div className="mb-4">
                {EditorComponent && (
                  <EditorComponent
                    value={content}
                    onChange={handleContentChange}
                    handleImageUpload={handleImageUpload}
                  />
                )}
              </div>
            </form>
          </div>
          <div className="[&>*:nth-child(even)]:my-8 md:w-1/4 p-4">
            <FeatureImage /* image={featureImage} onUpload={setFeatureImage} */
            />
            <Categories />
            <Tags />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BlogEditor;

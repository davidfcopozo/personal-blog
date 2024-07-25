"use client";
import React, { FormEvent } from "react";
import "react-quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Layout from "@/app/new-post/layout";
import Editor from "./editor";

const BlogEditor = () => {
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
    editorRef,
  } = useBlogEditor();

  return (
    <Layout onSave={handleSave}>
      <div className="flex">
        <div className="w-3/4 p-4">
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
              <Editor
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                handleImageUpload={handleImageUpload}
              />
            </div>
          </form>
        </div>
        <div className="w-1/4 p-4">
          <FeatureImage /* image={featureImage} onUpload={setFeatureImage} */ />
        </div>
      </div>
    </Layout>
  );
};

export default BlogEditor;

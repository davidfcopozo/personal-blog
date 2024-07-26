"use client";
import React, { FormEvent } from "react";
import "react-quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Layout from "@/app/new-post/layout";
import dynamic from "next/dynamic";
import Categories from "./categories";
import Tags from "./tags";
const Editor = dynamic(() => import("./editor"), { ssr: false });

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
  } = useBlogEditor();

  return (
    <Layout onSave={handleSave}>
      <div className="flex-column md:flex">
        <div className="mb-4 md:w-3/4 p-4">
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
                value={content}
                onChange={handleContentChange}
                handleImageUpload={handleImageUpload}
              />
            </div>
          </form>
        </div>
        <div className="[&>*:nth-child(even)]:my-8 md:w-1/4 p-4">
          <FeatureImage /* image={featureImage} onUpload={setFeatureImage} */ />
          <Categories />
          <Tags />
        </div>
      </div>
    </Layout>
  );
};

export default BlogEditor;

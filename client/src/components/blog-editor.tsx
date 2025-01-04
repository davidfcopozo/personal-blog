"use client";
import React, { FC, FormEvent, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Layout from "@/app/new/layout";
import Categories from "./categories";
import Tags from "./tags";
import dynamic from "next/dynamic";
import { BlogEditorProps } from "@/typings/interfaces";
import QuillLoadingSkeleton from "./quill-loading-skeleton";

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => <QuillLoadingSkeleton />,
});

const BlogEditor: FC<BlogEditorProps> = ({
  initialPost = null,
  slug = null,
  isPostLoading = false,
}) => {
  const handleSave = (e: FormEvent) => {
    handleSubmit(e);
  };

  const {
    title,
    content,
    featuredImage,
    temporaryFeatureImage,
    tags,
    categories,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleImageUpload,
    handleFeatureImagePick,
    setCategories,
    setTags,
    setTitle,
    setContent,
    setFeaturedImage,
  } = useBlogEditor({ initialPost, slug });

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setContent(initialPost.content || "");
      setFeaturedImage(initialPost.featuredImage || null);
      setCategories(initialPost.categories || []);
      setTags(initialPost.tags || []);
    }
  }, [initialPost]);

  return (
    <Layout onSave={handleSave}>
      <div className="flex-column md:flex">
        <div className={`mb-20 ${!isPostLoading && "p-4"} xs:mb-4 md:w-3/4  `}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {!isPostLoading && (
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter blog title"
                />
              )}
            </div>
            <div className="mb-4">
              <Editor
                value={content || (initialPost?.content as string)}
                onChange={handleContentChange}
                handleImageUpload={handleImageUpload}
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
          <Categories categories={categories} setCategories={setCategories} />
          <Tags tags={tags} setTags={setTags} />
        </div>
      </div>
    </Layout>
  );
};

export default BlogEditor;

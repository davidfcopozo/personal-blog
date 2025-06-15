"use client";
import React, { FC, useEffect, useState } from "react";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Categories from "./categories";
import Tags from "./tags";
import dynamic from "next/dynamic";
import { BlogEditorProps } from "@/typings/interfaces";
import { NewPostHeader } from "./new-post-header";
import { Skeleton } from "./ui/skeleton";

const TiptapBlogEditor = dynamic(() => import("./tiptap-blog-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] border border-muted-foreground/20 rounded-md">
      <div className="p-4 border-b border-muted-foreground/20">
        <div className="flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
});

const BlogEditor: FC<BlogEditorProps> = ({
  initialPost = null,
  slug = null,
  isPostLoading = false,
}) => {
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<
    "draft" | "published" | "unpublished"
  >(initialPost?.status || "draft");

  const handleSave = (status: "draft" | "published" | "unpublished") => {
    handleSubmit(status);
    // Update the current status immediately for UI feedback
    setCurrentStatus(status);
  };
  const {
    temporaryFeatureImage,
    postData,
    updatePostState,
    handleSubmit,
    handleContentChange,
    handleImageUpload,
    handleFeatureImagePick,
    hasUnsavedChanges,
  } = useBlogEditor({ initialPost, slug });

  const { title, content, featuredImage, tags, categories } = postData;
  useEffect(() => {
    if (initialPost) {
      updatePostState("title", initialPost.title || "");
      updatePostState("content", initialPost.content || "");
      updatePostState("featuredImage", initialPost.featuredImage || null);
      updatePostState("categories", initialPost.categories || []);
      updatePostState("tags", initialPost.tags || []);
      setCurrentStatus(initialPost.status || "draft");
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
      <NewPostHeader
        onSave={handleSave}
        currentStatus={currentStatus}
        hasChanges={hasUnsavedChanges()}
      />
      <main>
        <div className="flex-column md:flex">
          {" "}
          <div
            className={`mb-20 ${!isPostLoading && "p-4"} xs:mb-4 md:w-3/4  `}
          >
            <div>
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
              )}{" "}
              <div className="mb-4">
                <TiptapBlogEditor
                  value={content || (initialPost?.content as string)}
                  onChange={handleContentChange}
                  handleImageUpload={handleImageUpload}
                  onEditorReady={() => setIsEditorLoaded(true)}
                />
              </div>
            </div>
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

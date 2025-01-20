"use client";
import React, { FC, FormEvent, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Input } from "./ui/input";
import FeatureImage from "./feature-image";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import Categories from "./categories";
import Tags from "./tags";
import dynamic from "next/dynamic";
import { BlogEditorProps } from "@/typings/interfaces";
import QuillLoadingSkeleton from "./quill-loading-skeleton";
import { NewPostHeader } from "./new-post-header";

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

  return (
    <div className="outer-container">
      <NewPostHeader onSave={handleSave} />
      <main>
        <div className="flex-column md:flex">
          <div
            className={`mb-20 ${!isPostLoading && "p-4"} xs:mb-4 md:w-3/4  `}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                {!isPostLoading && (
                  <Input
                    id="title"
                    value={title}
                    /* onChange={handleTitleChange} */
                    onChange={(e) => updatePostState("title", e.target.value)}
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

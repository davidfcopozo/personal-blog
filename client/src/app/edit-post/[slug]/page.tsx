"use client";
import React from "react";
import BlogEditor from "@/components/blog-editor";
import useFetchPost from "@/hooks/useFetchPost";

const EditPostPage = ({ params }: { params: { slug: string } }) => {
  const slug = decodeURI(params.slug);
  const { data, isLoading, isFetching } = useFetchPost(slug);

  const post = data?.data;
  return (
    <div className="pt-24 bg-background min-h-screen">
      <div className="bg-background">
        <BlogEditor initialPost={post} slug={slug} />
      </div>
    </div>
  );
};

export default EditPostPage;

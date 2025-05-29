"use client";
import React, { use } from "react";
import BlogEditor from "@/components/blog-editor";
import useFetchPost from "@/hooks/useFetchPost";

const EditPostPage = (props: { params: Promise<{ slug: string }> }) => {
  const params = use(props.params);
  const slug = decodeURI(params.slug);
  const { data, isPending } = useFetchPost(slug);

  const post = data?.data;
  return (
    <div className="pt-24 bg-background min-h-screen">
      <div className="bg-background">
        <BlogEditor initialPost={post} slug={slug} isPostLoading={isPending} />
      </div>
    </div>
  );
};

export default EditPostPage;

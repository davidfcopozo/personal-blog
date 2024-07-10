"use client";
import BlogEditor from "@/components/blog-editor";
import React, { useMemo, useState } from "react";

const NewPostPage = () => {
  const [content, setContent] = useState("");

  const handleContentChange = (data: { title: string; content: string }) => {
    try {
      setContent(data.content);
    } catch (error) {
      console.error("Failed to auto-save:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting blog post with content:", content);
  };

  return (
    <div className="mt-24">
      <form onSubmit={handleSubmit}>
        <BlogEditor initialValue={content} onSave={handleContentChange} />
      </form>
    </div>
  );
};

export default NewPostPage;

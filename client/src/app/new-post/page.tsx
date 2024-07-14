"use client";
import BlogEditor from "@/components/blog-editor";
import React, { useMemo, useState } from "react";

const NewPostPage = () => {
  const handleSubmit = (
    e: React.FormEvent,
    data: { title: any; content: any }
  ) => {
    try {
      const { title, content } = data;
      e.preventDefault();
      /*       if (!title) {
        return;
      } */

      console.log("Submitting blog post with content:", content);
    } catch (error: Error | any) {
      console.log("error===>", error.message);
    }
  };

  return (
    <div className="pt-24 bg-background">
      <form className="bg-background">
        <BlogEditor onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default NewPostPage;

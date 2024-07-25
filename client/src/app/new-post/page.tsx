import React from "react";
import BlogEditor from "@/components/blog-editor";

const NewPostPage = () => {
  return (
    <div className="pt-24 bg-background min-h-screen">
      <div className="bg-background">
        <BlogEditor />
      </div>
    </div>
  );
};

export default NewPostPage;

"use client";
import { BlogPostCard } from "@/components/blog-post-card";
import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType } from "@/typings/types";

export default function Category({ params }: { params: { category: string } }) {
  const cat = decodeURI(params.category);

  function convertSlugToName(cat: string) {
    return cat
      ?.split("-")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const categoryToDisplay = convertSlugToName(cat);
  const {
    data: posts,
    error,
    isFetching,
  } = useFetchRequest("posts", `/api/posts`);

  const blogPosts: PostType[] = posts?.data.filter((post: PostType) =>
    post?.categories?.includes(categoryToDisplay)
  );

  console.log(blogPosts);

  return (
    <div className="container mx-auto px-4 mt-10 py-8">
      <h1 className="text-3xl font-bold mb-8">{`Latest ${categoryToDisplay} Blog Posts`}</h1>
      <div className="space-y-6">
        {blogPosts &&
          blogPosts.map((post) => (
            <BlogPostCard key={post._id.toString()} post={post} />
          ))}
      </div>
    </div>
  );
}

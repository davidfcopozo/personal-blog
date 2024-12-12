"use client";
import { BlogPostCard } from "@/components/blog-post-card";
import { PostSkeletonCard } from "@/components/post-skeleton";
import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType } from "@/typings/types";
import { convertSlugToName } from "@/utils/formats";
import { useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Category({ params }: { params: { category: string } }) {
  const cat = decodeURI(params.category);
  const { toast } = useToast();

  const categoryToDisplay = convertSlugToName(cat);
  const {
    data: posts,
    error,
    isFetching,
  } = useFetchRequest(["posts"], `/api/posts/category/${cat}`);

  const blogPosts: PostType[] = useMemo(() => {
    if (!posts?.data || !Array.isArray(posts.data)) {
      return [];
    }

    console.log(posts.data);

    return posts?.data; /* ?.filter((post: PostType) =>
      post?.categories?.some(
        (category) => category.toString() === categoryToDisplay
      )
    ); */
  }, [posts, cat]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  }, [error, toast]);

  return (
    <div className="container px-4 mt-14 py-8">
      <h1 className="text-3xl font-bold mb-10">{`Latest ${categoryToDisplay} Blog Posts`}</h1>
      <div className="space-y-6 flex justify-center flex-wrap md:justify-normal">
        {isFetching ? (
          <div className="w-full flex justify-center flex-wrap gap-4 mt-14 sm:w-2/3 md:w-3/4 pt-1 px-2">
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <BlogPostCard key={post._id.toString()} post={post} />
          ))
        ) : (
          <div className="w-full flex justify-center items-center">
            <p>Sorry, no posts to display!</p>
          </div>
        )}
      </div>
    </div>
  );
}

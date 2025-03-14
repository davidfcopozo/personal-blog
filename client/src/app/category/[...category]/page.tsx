"use client";
import { NewBlogPostCard } from "@/components/new-blog-post-card";
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

    return posts?.data;
  }, [posts]);

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
      <h1 className="text-3xl text-center md:text-start font-bold mb-8">{`Latest ${categoryToDisplay} Blog Posts`}</h1>
      <main className="py-6 lg:py-6 w-full lg:w-3/4">
        {isFetching ? (
          <div className="gap-8 grid-cols-1">
            <PostSkeletonCard />
            <PostSkeletonCard />
            <PostSkeletonCard />
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <NewBlogPostCard key={post._id.toString()} post={post} />
          ))
        ) : (
          <div className="w-full flex justify-center items-center">
            <p>Sorry, no posts to display!</p>
          </div>
        )}
      </main>
    </div>
  );
}

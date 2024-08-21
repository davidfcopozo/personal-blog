"use client";
import { BlogCard } from "@/components/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import useFetchRequest from "@/hooks/useFetchRequest";
import { useEffect, useMemo, useState } from "react";
import { PostSkeletonCard } from "@/components/post-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { PostType } from "@/typings/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const { toast } = useToast();
  const {
    data: posts,
    error,
    isFetching,
  } = useFetchRequest("posts", `/api/posts`);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  }, [error, toast]);

  const filteredPosts = useMemo(() => {
    if (!posts?.data || !Array.isArray(posts.data)) {
      return [];
    }
    return posts?.data
      ?.filter((post: PostType) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 2);
  }, [posts, searchQuery]);

  const blogCards = useMemo(() => {
    if (Array.isArray(posts?.data))
      return posts?.data?.map(
        (post: PostType, index: { toString: () => any }) => (
          <BlogCard
            key={post?._id.toString() + index.toString()}
            post={post}
            slug={post?.slug as string}
          />
        )
      );
  }, [posts]);

  return (
    <div className="container p-2 mx-auto">
      <div className="flex flex-row flex-wrap p-2 sm:p-4">
        <main
          role="main"
          className="w-full flex justify-center flex-wrap gap-4 mt-14 sm:w-2/3 md:w-3/4 pt-1 px-2"
        >
          {isFetching ? (
            <div className="w-full flex justify-center flex-wrap gap-4 mt-14 sm:w-2/3 md:w-3/4 pt-1 px-2">
              <PostSkeletonCard />
              <PostSkeletonCard />
              <PostSkeletonCard />
            </div>
          ) : (
            blogCards
          )}
        </main>
        <aside className="w-full hidden pt-12 sm:flex sm:flex-column sm:w-1/3 md:w-1/4 px-2 border-l-2 border-secondary">
          <div className="sticky top-16 p-4 bg-background rounded-xl w-full h-[84vh]">
            <div>
              <div className="flex ml-auto flex-col gap-8">
                <form className="ml-auto flex-1 sm:flex-start">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 ml-2 h-5 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search posts..."
                      className="rounded-full pl-10 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    {filteredPosts?.length > 0 && isFocused && searchQuery && (
                      <div className="absolute mt-4 bg-background rounded-md shadow-sm w-full">
                        {filteredPosts?.map((post: PostType) => (
                          <Link
                            key={`${post._id}`}
                            href={`/blog/${post.slug}`}
                            className="block px-4 py-3 hover:bg-muted/50 hover:rounded-lg transition-colors"
                            prefetch={false}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseUp={() => router.push(`/blog/${post.slug}`)}
                          >
                            {post.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
                <div className="flex ml-2 flex-col">
                  <p className="text-sm text-foreground font-semibold mb-4">
                    What do you want to read about?
                  </p>
                  <div className="flex flex-wrap gap-3 text-middle text-accent font-semibold text-background">
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      <p>CSS</p>
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Javascript
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Node Js
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Next.Js
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-7 ml-2 text-muted-foreground text-xs">
                <Link href="/#">Home</Link>
                <Link href="/#">Terms</Link>
                <Link href="/#">About</Link>
                <Link href="/#">Privacy</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

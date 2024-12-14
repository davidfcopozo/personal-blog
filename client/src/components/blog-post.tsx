"use client";
import useFetchPost from "@/hooks/useFetchPost";
import { getFullName, showMonthDayYear } from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SinglePostSkeleton from "./single-post-skeleton";
import CommentSection from "./comment-section";
import { PostType, UserType } from "@/typings/types";
import { useQueryClient } from "@tanstack/react-query";
import { EngagementButton } from "./engagement-button";
import { Heart, Bookmark, MessageSquare, Clock, Eye } from "lucide-react";
import { ShareButton } from "./share-button";

const BlogPost = ({ slug }: { slug: string }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useFetchPost(slug);
  const [hasInitialData, setHasInitialData] = useState(false);

  useEffect(() => {
    if (data?.data && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [data?.data, hasInitialData]);

  // Get the latest post data from the cache
  const post = queryClient.getQueryData<{ data: PostType }>([
    "post",
    slug,
  ])?.data;

  if (isLoading || (isFetching && !hasInitialData)) {
    return <SinglePostSkeleton />;
  }

  if (!post) {
    return (
      <div className="w-full h-full bg-background">
        <div className="w-full mx-auto mt-20 bg-background">
          <p className="text-center">Post not found or failed to load.</p>
        </div>
      </div>
    );
  }

  const postedBy = post.postedBy;

  return (
    <div className="w-full min-h-screen bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Engagement Tools */}
          <div className="order-2 lg:order-1 lg:w-20">
            <div className="lg:sticky lg:top-16 flex lg:flex-col justify-center gap-2 p-4 rounded-lg shadow-sm">
              <EngagementButton icon={Heart} count={42} label="Like post" />
              <EngagementButton icon={Bookmark} label="Save post" />
              <EngagementButton
                icon={MessageSquare}
                count={12}
                label="Comment"
              />
              <ShareButton post={post} />
            </div>
          </div>

          {/* Main */}
          <main className="order-1 lg:order-2 lg:flex-1">
            <article className=" rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                <Image
                  src={post.featuredImage as string}
                  alt="Blog Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="w-[90%] mx-auto flex md:gap-4 gap-2 justify-center items-center pt-4">
                <div className="flex gap-2 items-center">
                  <Link href="/#">
                    <Image
                      className="w-10 h-10 rounded-full"
                      src={postedBy?.avatar as string}
                      alt={`Avatar of ${getFullName(postedBy as UserType)}`}
                      width={300}
                      height={200}
                    />
                  </Link>
                  <Link
                    href="/#"
                    className="text-sm font-semibold dark:text-white"
                  >
                    {getFullName(postedBy as UserType)}
                  </Link>
                </div>
                <div className="dark:text-gray-500">|</div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {showMonthDayYear(post.createdAt?.toString() || "")}
                </h3>
                <div className="dark:text-gray-500">|</div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  5 min read
                </h4>
              </div>
              <h1 className="w-[92%] mx-auto text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
                {post.title}
              </h1>
              <div className="py-6 bg-background">
                <div
                  className="md:w-[80%] w-[90%] mx-auto pt-4"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              </div>
              <CommentSection
                comments={post.comments || []}
                id={`${post._id}`}
                post={post}
              />
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

"use client";
import useFetchPost from "@/hooks/useFetchPost";
import { getFullName, showMonthDayYear } from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import SinglePostSkeleton from "./single-post-skeleton";
import CommentSection from "./comment-section";
import { PostType, UserType } from "@/typings/types";

const BlogPost = ({ slug }: { slug: string }) => {
  const { data, isLoading, isFetching } = useFetchPost(slug);

  let post = useRef<PostType | null>();
  let postedBy = useRef<UserType | null>();

  useEffect(() => {
    if (window && window.location.hash) {
      const element = document.getElementById(window.location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    post.current = data?.data;
    postedBy.current = post.current?.postedBy;
  }, [post]);

  if (isLoading || isFetching) {
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

  return (
    <div className="w-full h-full bg-background">
      <div className="w-full mx-auto mt-10 bg-background">
        <h1 className="w-[92%] mx-auto text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
          {post.current?.title}
        </h1>
        <div className="flex items-center justify-center xl:w-[80%] w-[96%] mx-auto lg:h-[560px] md:h-[480px]">
          <Image
            src={post.current?.featuredImage as string}
            alt="Blog Cover"
            className="rounded-lg overflow-hidden aspect-square"
            width={500}
            height={250}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="w-[90%] mx-auto flex md:gap-4 gap-2 justify-center items-center pt-4">
          <div className="flex gap-2 items-center">
            <Link href="/#">
              <Image
                className="w-10 h-10 rounded-full"
                src={postedBy?.current?.avatar as string}
                alt={`Avatar of ${getFullName(postedBy.current as UserType)}`}
                width={300}
                height={200}
              />
            </Link>
            <Link href="/#" className="text-sm font-semibold dark:text-white">
              {getFullName(postedBy.current as UserType)}
            </Link>
          </div>
          <div className="dark:text-gray-500">|</div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {showMonthDayYear(post.current?.createdAt?.toString() as string)}
          </h3>
          <div className="dark:text-gray-500">|</div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            5 min read
          </h4>
        </div>
        <div className="py-6 bg-background">
          <div
            className="md:w-[80%] w-[90%] mx-auto pt-4"
            dangerouslySetInnerHTML={{ __html: post.current?.content || "" }}
          />
        </div>
        <CommentSection
          comments={post.current?.comments as string[]}
          id={post.current?._id.toString() as string}
        />
      </div>
    </div>
  );
};

export default BlogPost;

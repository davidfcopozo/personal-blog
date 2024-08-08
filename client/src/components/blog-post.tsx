"use client";
import useFetchPost from "@/hooks/useFetchPost";
import { getFullName, showMonthDayYear } from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPost = ({ slug }: { slug: string }) => {
  const { data } = useFetchPost(slug);

  const post = data?.data;
  return (
    <div className="w-full h-full bg-background">
      <div className="w-full mx-auto py-10 bg-background">
        {/* Breadcrumbs */}

        {/*         <div className="w-[94%] text-xs mt-10 mx-auto flex gap-1 items-center text-gray-500 sm:text-[12px] xs:text-[10px] font-semibold dark:text-gray-400">
          <div>Blog</div>
          <div className="font-semibold text-xs">{">"}</div>
          <div>Framework</div>
          <div className="font-semibold text-xs">{">"}</div>
          <div>Why Tailwind CSS Wins My Utility Belt</div>
        </div> */}

        <h1 className="w-[92%] mx-auto text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
          {post?.title}
        </h1>

        {/* Blog cover */}
        <div className="flex items-center justify-center xl:w-[80%] w-[96%] mx-auto lg:h-[560px] md:h-[480px]">
          <Image
            src={post?.featuredImage}
            alt="Blog Cover"
            className="rounded-lg overflow-hidden aspect-square"
            width={500}
            height={250}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/*  <!-- Blog Info --> */}
        <div className="w-[90%] mx-auto flex md:gap-4 gap-2 justify-center items-center pt-4">
          <div className="flex gap-2 items-center">
            <Link href="/#">
              <Image
                className="w-10 h-10 rounded-full"
                src={post?.postedBy?.avatar}
                alt="Avatar of Jonathan Reinink"
                width={300}
                height={200}
              />
            </Link>
            <Link href="/#" className="text-sm font-semibold dark:text-white">
              {getFullName(post?.postedBy)}
            </Link>
          </div>
          <div className="dark:text-gray-500">|</div>

          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {showMonthDayYear(post?.createdAt)}
          </h3>

          <div className="dark:text-gray-500">|</div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            5 min read
          </h4>
        </div>

        {/* <!-- Blog --> */}
        <div className="py-6 bg-background">
          <div
            className="md:w-[80%] w-[90%] mx-auto pt-4"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

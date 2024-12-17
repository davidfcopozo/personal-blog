"use client";
import { getFullName, showMonthDayYear } from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CommentSection from "./comment-section";
import { UserType } from "@/typings/types";
import { EngagementButton } from "./engagement-button";
import { Heart, Bookmark, MessageSquare, Clock, Eye } from "lucide-react";
import { ShareButton } from "./share-button";
import scrollToElement from "@/utils/scrollToElement";
import { BlogPostProps } from "@/typings/interfaces";
import { AuthorPanel } from "./author-panel";

const BlogPost = ({
  handleLikeClick,
  handleBookmarkClick,
  amountOfLikes,
  liked,
  bookmarked,
  amountOfBookmarks,
  post,
}: BlogPostProps) => {
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
            <div className="lg:sticky bg-muted lg:top-[5.5rem] flex lg:flex-col justify-center gap-2 p-4 rounded-3xl shadow-sm">
              <EngagementButton
                icon={Heart}
                count={amountOfLikes}
                label="Like post"
                onClick={handleLikeClick}
                iconStyles={liked ? "text-pink-500" : "hover:stroke-pink-500"}
                activeColor="text-pink-500"
                isActivated={liked}
              />
              <EngagementButton
                icon={Bookmark}
                count={amountOfBookmarks}
                label="Save post"
                onClick={handleBookmarkClick}
                iconStyles={
                  bookmarked ? "stroke-indigo-500" : "hover:stroke-indigo-500"
                }
                isActivated={bookmarked}
                activeColor="text-indigo-500"
              />
              <EngagementButton
                icon={MessageSquare}
                count={post.comments?.length}
                label="Comment"
                iconStyles="hover:stroke-amber-500"
                onClick={() => scrollToElement("comments-section", "header")}
                activeColor="text-amber-500"
              />
              <ShareButton post={post} />
            </div>
          </div>

          {/* Main */}
          <main className="order-1 lg:order-2 lg:flex-1">
            <article className=" rounded-lg overflow-hidden mt-6">
              <div className="w-full rounded-lg overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                <Image
                  src={post.featuredImage as string}
                  alt="Blog Cover"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex md:gap-4 gap-2 justify-center items-center pt-4">
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
              <h1 className="text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
                {post.title}
              </h1>
              <div className="py-6 bg-background">
                <div
                  className="md:w-[80%] w-[90%] pt-4"
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
          {/* Right Panel - Author Info */}
          <div className="order-3 lg:w-72">
            <div className=" lg:mt-6">
              <AuthorPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

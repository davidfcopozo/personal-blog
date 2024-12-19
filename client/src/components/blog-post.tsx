"use client";
import {
  calculateReadingTime,
  getFullName,
  showMonthDayYear,
} from "@/utils/formats";
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
              <div className="flex md:gap-4 gap-2  items-center pt-4">
                <div className="flex w-full justify-between items-center text-sm text-gray-400 mb-6">
                  <div className="flex">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {calculateReadingTime(post.content || "")}
                    </span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.createdAt?.toString() || ""}>
                      {showMonthDayYear(post.createdAt?.toString() || "")}
                    </time>
                  </div>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.visits} views
                  </span>
                </div>
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
              <CommentSection comments={post.comments || []} post={post} />
            </article>
          </main>
          {/* Right Panel - Author Info */}
          <div className="order-3 lg:w-72">
            <div className=" lg:mt-6">
              <AuthorPanel
                _id={post?.postedBy?._id}
                firstName={post?.postedBy?.firstName as string}
                lastName={post?.postedBy?.lastName as string}
                email={post?.postedBy?.email as string}
                username={post?.postedBy?.username as string}
                avatar={post?.postedBy?.avatar as string}
                bio={post?.postedBy?.bio as string}
                website={post?.postedBy?.website as string}
                title={post?.postedBy?.title as string}
                socialMedia={
                  post?.postedBy
                    ?.socialMediaProfiles as UserType["socialMediaProfiles"]
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

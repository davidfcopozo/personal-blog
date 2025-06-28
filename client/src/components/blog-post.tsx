"use client";
import {
  calculateReadingTime,
  getFullName,
  showMonthDayYear,
} from "@/utils/formats";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import CommentSection from "./comment-section";
import { UserType } from "@/typings/types";
import ContentRenderer from "./ui/content-renderer";
import { EngagementButton } from "./engagement-button";
import { Heart, Bookmark, MessageSquare, Clock, Eye, Edit } from "lucide-react";
import { ShareButton } from "./share-button";
import scrollToElement from "@/utils/scrollToElement";
import { BlogPostProps } from "@/typings/interfaces";
import { AuthorPanel } from "./author-panel";
import { useFollowUser } from "@/hooks/useFollowUser";
import { AuthModal } from "./auth-modal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const BlogPost = memo(function BlogPost({
  handleLikeClick,
  handleBookmarkClick,
  amountOfLikes,
  liked,
  bookmarked,
  amountOfBookmarks,
  post,
}: BlogPostProps) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const {
    handleFollowToggle,
    isPending,
    isFollowed,
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
  } = useFollowUser(post?.postedBy as UserType);

  // Check if current user is the post owner
  const isPostOwner = currentUser?.data?._id === post?.postedBy?._id;

  const handleEditPost = () => {
    if (post?.slug) {
      router.push(`/edit-post/${post.slug}`);
    }
  };

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
          {" "}
          {/* Left Panel - Engagement Tools */}
          <div className="order-2 lg:order-1 lg:w-20 hidden lg:block">
            <div className="lg:sticky bg-muted lg:top-[5.5rem] flex lg:flex-col justify-center gap-2 p-4 rounded-3xl shadow-sm">
              {isPostOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditPost}
                  className="flex flex-col items-center gap-1 h-auto p-2 hover:bg-accent rounded-lg"
                  title="Edit post"
                >
                  <Edit className="h-5 w-5 text-muted-foreground hover:text-orange-500" />
                  <span className="text-xs text-muted-foreground">Edit</span>
                </Button>
              )}
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
            <article className="rounded-lg overflow-hidden mt-6">
              <div className="flex flex-col">
                <div className="w-full order-2 lg:order-1 rounded-lg overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] relative">
                  <Image
                    src={post.coverImage as string}
                    alt="Blog Cover"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="order-1 mx-auto w-[90%] lg:mx-0 lg:w-full lg:order-2 flex flex-col gap-4 p-4">
                  {/* METADATA */}
                  <div className="flex flex-col md:gap-4 order-2 lg:order-1 gap-2 items-center pt-4 lg:pt-0">
                    <div className="flex w-full justify-between items-center text-sm text-gray-400 lg:mb-6">
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/${postedBy?.username}`}
                          className="flex lg:hidden gap-2 items-center"
                        >
                          <Image
                            className="w-14 h-14 rounded-full"
                            src={postedBy?.avatar as string}
                            alt={`Avatar of ${getFullName(
                              postedBy as UserType
                            )}`}
                            width={300}
                            height={200}
                          />
                        </Link>
                        <div className="flex flex-col gap-1">
                          <div className="lg:hidden">
                            <Link
                              href={`/${postedBy?.username}`}
                              className="text-base font-semibold text-foreground hover:text-[--thread-border] transition-all duration-300"
                            >
                              {getFullName(postedBy as UserType)}
                            </Link>
                            {!isPostOwner && (
                              <>
                                <span className="mx-2">•</span>
                                <button
                                  className={`${
                                    isFollowed
                                      ? "text-amber-500 hover:text-[--thread-border]"
                                      : "text-[--thread-border] hover:text-amber-500"
                                  }`}
                                  disabled={isPending}
                                  onClick={handleFollowToggle}
                                >
                                  {isFollowed ? "Following" : "Follow"}
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {calculateReadingTime(post.content || "")}
                            </span>
                            <span className="mx-2">•</span>
                            <time dateTime={post.createdAt?.toString() || ""}>
                              {showMonthDayYear(
                                post.createdAt?.toString() || ""
                              )}
                            </time>
                          </div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.visits} views
                      </span>
                    </div>{" "}
                    {/* Engagement buttons */}
                    <div className="flex lg:hidden w-[100%] border-y-[1px] mt-2 w-100">
                      <div className="flex w-[100%] lg:flex-col justify-start rounded-3xl shadow-sm">
                        {isPostOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditPost}
                            className="flex items-center gap-1 p-0 h-auto px-3 py-2 hover:bg-accent rounded-lg"
                            title="Edit post"
                          >
                            <Edit className="h-5 w-5 text-muted-foreground hover:text-orange-500" />
                            <span className="text-sm text-muted-foreground">
                              Edit
                            </span>
                          </Button>
                        )}
                        <EngagementButton
                          icon={Heart}
                          extraClasses="p-0"
                          count={amountOfLikes}
                          label="Like post"
                          onClick={handleLikeClick}
                          iconStyles={`!h-5 !w-5 ${
                            liked ? "text-pink-500" : "hover:stroke-pink-500"
                          }`}
                          activeColor="text-pink-500"
                          isActivated={liked}
                          horizontalCount
                        />
                        <EngagementButton
                          icon={Bookmark}
                          count={amountOfBookmarks}
                          label="Save post"
                          extraClasses="p-0"
                          onClick={handleBookmarkClick}
                          iconStyles={`!h-5 !w-5 ${
                            bookmarked
                              ? "stroke-indigo-500"
                              : "hover:stroke-indigo-500"
                          }`}
                          isActivated={bookmarked}
                          activeColor="text-indigo-500"
                          horizontalCount
                        />
                        <EngagementButton
                          icon={MessageSquare}
                          extraClasses="p-0"
                          count={post.comments?.length}
                          label="Comment"
                          iconStyles={`!h-5 !w-5 ${"hover:stroke-amber-500"}`}
                          onClick={() =>
                            scrollToElement("comments-section", "header")
                          }
                          activeColor="text-amber-500"
                          horizontalCount
                        />
                      </div>
                      <ShareButton post={post} />
                    </div>
                  </div>
                  <h1 className="order-1 lg:order-2 text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
                    {post.title}{" "}
                  </h1>
                </div>
              </div>
              <div className="py-6 bg-background">
                <ContentRenderer
                  content={post.content || ""}
                  className="md:w-[80%] w-[90%] pt-4"
                />
              </div>
              <CommentSection comments={post.comments || []} post={post} />
            </article>
          </main>
          {/* Right Panel - Author Info */}
          <div className="order-3 w-72 mx-auto hidden lg:block">
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
                handleFollowToggle={handleFollowToggle}
                isPending={isPending}
                isFollowed={isFollowed}
                isPostOwner={isPostOwner}
              />
            </div>
          </div>
        </div>
      </div>{" "}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        action={authModalAction || "follow"}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
});

export default BlogPost;

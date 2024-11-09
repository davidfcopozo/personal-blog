import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useInteractions } from "@/hooks/useInteractions";
import { BlogPostCardProps } from "@/typings/types";
import {
  calculateReadingTime,
  extractFirstParagraphText,
  getFullName,
  getNameInitials,
  showMonthDay,
  truncateText,
} from "@/utils/formats";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const {
    title,
    content,
    createdAt,
    bookmarks,
    likes,
    comments,
    featuredImage,
    postedBy,
    slug,
  } = post;
  const { _id: userID, username } = postedBy;
  const { likeInteraction, bookmarkInteraction } = useInteractions();
  let description = extractFirstParagraphText(content as string);
  const [currentUser, setCurrentUser] = useState("");
  const [liked, setLiked] = useState(false);
  const [amountOfLikes, setAmountOfLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [amountOfBookmarks, setAmountOfBookmarks] = useState(0);

  useEffect(() => {
    async function getUserId() {
      const session = await getSession();
      if (session?.user?.id) {
        setCurrentUser(`${session.user.id}`);
      }
    }

    getUserId();
  }, []);

  useEffect(() => {
    if (currentUser && likes?.length) {
      const userLiked = likes.some((like) => like.toString() === currentUser);
      setLiked(userLiked);
      setAmountOfLikes(likes.length);
    }

    if (currentUser && bookmarks?.length) {
      const userBookmarked = bookmarks.some(
        (bookmark) => bookmark.toString() === currentUser
      );
      setBookmarked(userBookmarked);
      setAmountOfBookmarks(bookmarks.length);
    }
  }, [currentUser, likes, bookmarks]);

  const handleLikeClick = (e: MouseEvent) => {
    e.preventDefault();

    // Optimistic UI changes
    const previousLikedState = liked;
    const previousLikesCount = amountOfLikes;

    setLiked(!liked);
    setAmountOfLikes((prev) => (liked ? prev - 1 : prev + 1));

    likeInteraction(post._id.toString(), {
      onError: () => {
        // Rollback UI changes on error
        setLiked(previousLikedState);
        setAmountOfLikes(previousLikesCount);
      },
    });
  };

  const handleBookmarkClick = (e: MouseEvent) => {
    e.preventDefault();

    const previousBookmarkedState = bookmarked;
    const previousBookmarksCount = amountOfBookmarks;

    setBookmarked(!bookmarked);
    setAmountOfBookmarks((prev) => (bookmarked ? prev - 1 : prev + 1));

    bookmarkInteraction(post._id.toString(), {
      onError: () => {
        setBookmarked(previousBookmarkedState);
        setAmountOfBookmarks(previousBookmarksCount);
      },
    });
  };

  return (
    <div className="flex flex-col max-w-sm md:max-h-[250px] md:flex-row sm:max-w-full border rounded-lg overflow-hidden shadow-sm mb-6 transition-all duration-300 hover:scale-[1.02]">
      <Link className="md:w-1/3" href={`/${username}/${slug}`}>
        <Image
          src={featuredImage as string}
          alt={title as string}
          width={400}
          height={300}
          style={{ objectFit: "cover" }}
          className="w-full h-full"
        />
      </Link>
      <div className="w-full p-6 flex flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {calculateReadingTime(content as string)}
          </p>
          <Link href={`/${username}/${slug}`}>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-foreground text-base mb-4">
              {truncateText(description as string, 150)}
            </p>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="flex sm:items-center space-x-4">
            <Link
              href={`/users/${userID.toString()}`}
              className="font-semibold"
            >
              <Avatar>
                <AvatarImage
                  src={postedBy?.avatar as string}
                  alt={getFullName(postedBy)}
                />
                <AvatarFallback>{getNameInitials(postedBy)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/users/${userID.toString()}`}
                className="font-semibold"
              >
                {getFullName(postedBy)}
              </Link>
              <p className="text-sm text-muted-foreground">
                {showMonthDay(createdAt!.toString())}
              </p>
            </div>
          </div>
          <div className="flex space-x-1 sm:mr-6">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleBookmarkClick}
              className="group flex items-center focus:outline-none transition-colors duration-300 hover:bg-transparent hover:shadow-[inset_0px_0px_40px_0px_rgba(29,161,242,0.2)] "
            >
              <div className="relative">
                <Bookmark
                  className={`h-4 w-4 transition-colors duration-300 ${
                    bookmarked ? "stroke-[#1d9bf0]" : "stroke-gray-400"
                  }`}
                />
                <Bookmark
                  className={`absolute inset-0 h-4 w-4 text-[#1d9bf0]  transition-all duration-300 ${
                    bookmarked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
              <div className="relative w-4 h-4 overflow-hidden">
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    bookmarked ? "-translate-y-full" : "translate-y-0"
                  }`}
                >
                  <span className="text-sm text-center text-gray-400 pl-[0.1em]">
                    {amountOfBookmarks}
                  </span>
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    bookmarked ? "translate-y-0" : "translate-y-full"
                  }`}
                >
                  <span className="text-sm text-center pl-[0.1em] text-[#1d9bf0]">
                    {amountOfBookmarks}
                  </span>
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleLikeClick}
              className="group flex items-center focus:outline-none transition-colors duration-300 hover:bg-transparent hover:shadow-[inset_0px_0px_40px_0px_rgba(236,72,153,0.2)] "
            >
              <div className="relative">
                <Heart
                  className={`h-4 w-4 transition-colors duration-300 ${
                    liked ? "stroke-pink-500" : "stroke-gray-400"
                  }`}
                />
                <Heart
                  className={`absolute inset-0 h-4 w-4 text-pink-500 transition-all duration-300 ${
                    liked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
              <div className="relative w-4 h-4 overflow-hidden">
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    liked ? "-translate-y-full" : "translate-y-0"
                  }`}
                >
                  <span className="text-sm text-center text-gray-400 pl-[0.1em]">
                    {amountOfLikes}
                  </span>
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    liked ? "translate-y-0" : "translate-y-full"
                  }`}
                >
                  <span className="text-sm text-center pl-[0.1em] text-pink-500">
                    {amountOfLikes}
                  </span>
                </div>
              </div>
            </Button>
            <Link href={`/${username}/${post.slug}#comments-section`} passHref>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4 stroke-gray-400" />
                <span className="text-sm text-center text-gray-400 pl-[0.2em]">
                  {comments?.length}
                </span>
                <span className="sr-only">Comment</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Bookmark, Clock, Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EngagementButton } from "./engagement-button";
import { Card, CardFooter } from "./ui/card";

export const NewBlogPostCard = ({ post }: BlogPostCardProps) => {
  const { title, content, createdAt, comments, featuredImage, postedBy, slug } =
    post;
  const { _id: userID, username } = postedBy;
  const {
    handleLikeClick,
    handleBookmarkClick,
    liked,
    bookmarked,
    amountOfBookmarks,
    amountOfLikes,
  } = useInteractions(post);
  let description = extractFirstParagraphText(content as string);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      {/* <Link className="flex flex-col md:flex-row" href={`/${username}/${slug}`}> */}
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 w-full  md:w-2/5">
          <Image
            src={featuredImage as string}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            <Clock className="h-3 w-3" />
            <span>{calculateReadingTime(content as string)}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-2">
            <Link href={`/${username}`} className="font-semibold">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={postedBy?.avatar as string}
                  alt={getFullName(postedBy)}
                />
                <AvatarFallback>{getNameInitials(postedBy)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-sm">
              <Link href={`/${username}`} className="font-semibold">
                <p className="font-medium">{getFullName(postedBy)}</p>
              </Link>
              <p className="text-muted-foreground">
                {showMonthDay(createdAt!.toString())}
              </p>
            </div>
          </div>

          <Link href={`/${username}/${slug}`} className="group flex-1">
            <h3 className="mb-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="mb-4 line-clamp-2 text-muted-foreground">
              {truncateText(description as string, 150)}
            </p>
          </Link>

          <CardFooter className="flex justify-between p-0 pt-4">
            <div className="flex gap-2">
              <EngagementButton
                icon={Heart}
                count={amountOfLikes}
                label="Like post"
                onClick={handleLikeClick}
                iconStyles={`${
                  liked
                    ? "stroke-pink-500"
                    : "stroke-gray-400 hover:stroke-pink-500"
                } !h-4 !w-4`}
                activeColor="text-pink-500"
                isActivated={liked}
                horizontalCount
              />
              <Link
                href={`/${username}/${post.slug}#comments-section`}
                passHref
              >
                <EngagementButton
                  icon={MessageSquare}
                  count={post.comments?.length}
                  label="Comment"
                  iconStyles="hover:stroke-amber-500 !h-4 !w-4"
                  activeColor="text-amber-500"
                  horizontalCount
                />
              </Link>
            </div>
            <EngagementButton
              icon={Bookmark}
              count={amountOfBookmarks}
              label="Save post"
              onClick={handleBookmarkClick}
              iconStyles={`${
                bookmarked
                  ? "stroke-indigo-500"
                  : "stroke-gray-400 hover:stroke-indigo-500"
              } !h-4 !w-4`}
              activeColor="text-indigo-500"
              isActivated={bookmarked}
              horizontalCount
            />
          </CardFooter>
        </div>
      </div>
      {/* </Link> */}
    </Card>
  );
};

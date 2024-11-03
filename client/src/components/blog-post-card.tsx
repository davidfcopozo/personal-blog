import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

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

  let description = extractFirstParagraphText(content as string);

  const handleBookmarkClick = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("Bookmark clicked");
  };

  const handleLikeClick = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("Like clicked");
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
            <Button variant="ghost" size="icon" onClick={handleBookmarkClick}>
              <Bookmark className="h-4 w-4" />
              <span className="text-sm text-center pl-[0.1em]">
                {bookmarks?.length}
              </span>
              <span className="sr-only">Bookmark</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLikeClick}>
              <Heart className="h-4 w-4" />
              <span className="text-sm text-center pl-[0.2em]">
                {likes?.length}
              </span>
              <span className="sr-only">Like</span>
            </Button>
            <Link href={`/${username}/${post.slug}#comments-section`} passHref>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm text-center pl-[0.2em]">
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

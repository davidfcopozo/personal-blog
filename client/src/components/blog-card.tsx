import {
  calculateReadingTime,
  extractFirstParagraphText,
  getFullName,
  getNameInitials,
  showMonthDay,
  truncateText,
} from "@/utils/formats";
import { Bookmark, Clock, MessageCircle, ThumbsUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { BlogPostProps } from "@/typings/types";
import { useUser } from "@/hooks/useUser";
import { FC, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export const BlogCard: FC<BlogPostProps> = ({ post, slug }) => {
  const {
    title,
    content,
    createdAt,
    bookmarks,
    likes,
    comments,
    featuredImage,
    postedBy,
  } = post;

  const {
    data: user,
    isLoading,
    error,
  } = useUser(postedBy._id.toString() as string);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  }, [error, toast]);

  let description = extractFirstParagraphText(content as string);

  return (
    <Link
      href={`/blog/${slug}`}
      className="max-w-sm w-full rounded-b-lg border-b rounded-b-lg transition-all duration-300 lg:max-w-full lg:flex lg:border-x-0 lg:border-secondary lg:rounded-b-none hover:scale-[1.02] lg:hover:rounded-b hover:shadow-[0px_1px_0px_0px] hover:shadow-muted-foreground"
    >
      <div className="flex h-48 lg:w-48 lg:h-auto rounded-t lg:rounded-tr-none lg:rounded-l text-center overflow-hidden">
        <Image
          src={featuredImage as string}
          alt=""
          width={250}
          height={100}
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col justify-between leading-normal  px-4 py-4 bg-transparent lg:pt-0">
        <div className="mb-8">
          <p className="text-sm gap-1 text-center text-muted-foreground flex items-center pb-2">
            <Clock size={16} strokeWidth={2} />
            {calculateReadingTime(content as string)}
          </p>
          <Link href="#" legacyBehavior>
            <a>
              <h2 className="text-foreground font-bold text-xl mb-2">
                {title}
              </h2>
              <p className="text-foreground text-base">
                {truncateText(description as string, 150)}
              </p>
            </a>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/#">
              <Avatar className="w-10 h-10 border  mr-4">
                <AvatarImage src={user?.data?.avatar as string} />
                <AvatarFallback>{getNameInitials(user)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-sm">
              <Link href="/#" legacyBehavior>
                <a className="text-muted-foreground font-semibold leading-none transition-all duration-300 hover:text-foreground">
                  {getFullName(user?.data)}
                </a>
              </Link>
              <p className="text-muted-foreground">
                {showMonthDay(createdAt!.toString())}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <div className="flex justify-center transition-all duration-300 cursor-pointer hover:text-foreground">
              <Bookmark size={18} strokeWidth={2} />
              <span className="text-sm pl-[0.2em]">{bookmarks?.length}</span>
            </div>
            <div className="flex justify-center transition-all duration-300 cursor-pointer hover:text-foreground">
              <ThumbsUp size={18} strokeWidth={2} />
              <span className="text-sm pl-[0.2em]">{likes?.length}</span>
            </div>
            <Link href="#" legacyBehavior>
              <a className="flex justify-center transition-all duration-300 hover:text-foreground">
                <MessageCircle size={18} strokeWidth={2} />
                <span className="text-sm pl-[0.2em]">{comments?.length}</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

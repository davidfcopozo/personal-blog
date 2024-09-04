import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { PostType } from "@/typings/types";
import {
  calculateReadingTime,
  getFullName,
  getNameInitials,
  showMonthDay,
} from "@/utils/formats";
import { Archive, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

export const BlogPostCard = ({ post }: { key: string; post: PostType }) => {
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

  return (
    <div className="flex flex-col md:flex-row w-full border rounded-lg overflow-hidden shadow-sm mb-6">
      <div className="md:w-1/3">
        <Image
          src={featuredImage as string}
          alt={title as string}
          width={400}
          height={300}
          style={{ objectFit: "cover" }}
          className="w-full h-full"
        />
      </div>
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {calculateReadingTime(content as string)}
          </p>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={user?.data?.avatar as string}
                alt={getFullName(user?.data)}
              />
              <AvatarFallback>{getNameInitials(user)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{getFullName(user?.data)}</p>
              <p className="text-sm text-muted-foreground">
                {showMonthDay(createdAt!.toString())}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-4 w-4" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { getFullName, getNameInitials, getRelativeTime } from "@/utils/formats";
import { ReplyProps } from "@/typings/types";
import useFetchRequest from "@/hooks/useFetchRequest";

const Reply: React.FC<ReplyProps> = ({ reply }) => {
  const { data: postedBy } = useFetchRequest(
    "commentPostedBy",
    `/api/users/${reply?.postedBy}`
  );
  return (
    <div key={`${reply?._id}`} className="flex items-start gap-4 pl-14">
      <Avatar className="w-10 h-10 border">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>{getNameInitials(postedBy?.data)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-2 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">{getFullName(postedBy?.data)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getRelativeTime(reply?.createdAt!)}
          </div>
        </div>
        <p>{reply?.content}</p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <MessageCircle className="w-4 h-4" />
            <span className="sr-only">Reply</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex align-center text-center gap-1"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">
              {reply?.likes?.length}
            </span>
            <span className="sr-only">Like</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reply;

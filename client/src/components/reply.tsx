import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

interface ReplyProps {
  reply: {
    _id: string;
    content: string;
    createdAt: Date;
  };
}

const Reply: React.FC<ReplyProps> = ({ reply }) => {
  const { _id, content, createdAt } = reply;
  return (
    <div className="flex items-start gap-4 pl-14">
      <Avatar className="w-10 h-10 border">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="grid gap-2 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">John Doe</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getRelativeTime(createdAt, "es")}
          </div>
        </div>
        <p>{content}</p>
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
            <span className="text-xs text-muted-foreground">155</span>
            <span className="sr-only">Like</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reply;

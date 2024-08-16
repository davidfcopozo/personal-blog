import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Reply from "./reply";
import { getRelativeTime } from "@/utils/formats";
import { CommentProps } from "@/typings/types";
import useCommentFetch from "@/hooks/useCommentFetch";

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { data: fetchedReplies } = useCommentFetch(comment.replies);

  return (
    <>
      <div id={`${comment?._id}`} className="flex items-start gap-4">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="grid gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-medium">Acme Inc</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getRelativeTime(comment?.createdAt!)}
            </div>
          </div>
          <p>{comment?.content}</p>
          <div className="flex items-center gap-2">
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
                {comment.likes.length}
              </span>
              <span className="sr-only">Like</span>
            </Button>
          </div>
        </div>
      </div>

      {fetchedReplies &&
        fetchedReplies?.length >= 1 &&
        fetchedReplies.map((reply) => (
          <Reply key={`${reply?._id}`} reply={reply} />
        ))}
    </>
  );
};

export default Comment;

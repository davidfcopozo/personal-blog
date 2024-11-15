import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Reply from "./reply";
import { getFullName, getNameInitials, getRelativeTime } from "@/utils/formats";
import { CommentProps } from "@/typings/types";
import useCommentFetch from "@/hooks/useCommentFetch";
import CommentSkeleton from "./comment-skeleton";
import useFetchRequest from "@/hooks/useFetchRequest";
import { CommentInterface } from "@/typings/interfaces";

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const {
    data: fetchedReplies,
    isLoading,
    isFetching,
  } = useCommentFetch(
    comment?.replies?.length >= 1 ? comment?.replies : [],
    "replies"
  );

  const { data: postedBy } = useFetchRequest(
    "commentPostedBy",
    `/api/users/${comment.postedBy}`
  );

  return (
    <>
      {isLoading || isFetching ? (
        <CommentSkeleton />
      ) : (
        <div>
          <div id={`${comment?._id}`} className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{getNameInitials(postedBy?.data)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="font-medium">{getFullName(postedBy?.data)}</div>
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
            fetchedReplies.map((reply: CommentInterface) => (
              <Reply key={`${reply?._id}`} reply={reply} />
            ))}
        </div>
      )}
    </>
  );
};

export default Comment;

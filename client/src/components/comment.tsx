"use client";

import React, { MouseEvent, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, MoreVertical } from "lucide-react";
import Reply from "./reply";
import { getFullName, getNameInitials, getRelativeTime } from "@/utils/formats";
import { CommentProps } from "@/typings/types";
import useCommentFetch from "@/hooks/useCommentFetch";
import CommentSkeleton from "./comment-skeleton";
import useFetchRequest from "@/hooks/useFetchRequest";
import { CommentInterface } from "@/typings/interfaces";
import { useInteractions } from "@/hooks/useInteractions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useDeleteRequest from "@/hooks/useDeleteRequest";

const Comment: React.FC<CommentProps> = ({ comment, post }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate } = useDeleteRequest();

  const {
    data: fetchedReplies,
    isLoading,
    isFetching,
  } = useCommentFetch(
    comment?.replies?.length >= 1 ? comment?.replies : [],
    "replies"
  );

  const { data: postedBy } = useFetchRequest(
    ["commentPostedBy"],
    `/api/users/${comment?.postedBy}`
  );

  const { likeCommentInteraction, commentLiked, commentLikesCount } =
    useInteractions(`${post._id}`, post, comment);

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    likeCommentInteraction(`${comment._id}`, {
      onError: () => {
        console.error("Error handling like interaction");
      },
    });
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit comment");
  };

  const handleReportAbuse = () => {
    // Implement report abuse functionality
    console.log("Report abuse");
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Delete comment");
    mutate({
      url: `/api/comments/${post?._id}/${comment?._id}`,
      itemId: `${comment?._id}`,
      key: "comments",
    });
    setIsDeleteDialogOpen(false);
  };

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReportAbuse}>
                      Report Abuse
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  type="button"
                  onClick={handleLikeClick}
                  className="group flex items-center focus:outline-none transition-colors duration-300 hover:bg-transparent hover:shadow-[inset_0px_0px_40px_0px_rgba(73,134,255,0.2)] "
                >
                  <div className="relative">
                    <ThumbsUp
                      className={`h-4 w-4 transition-colors duration-300 ${
                        commentLiked ? "stroke-[#49a4ff]" : "stroke-gray-400"
                      }`}
                    />
                    <ThumbsUp
                      className={`absolute inset-0 h-4 w-4 text-[#49a4ff] transition-all duration-300 ${
                        commentLiked
                          ? "scale-100 opacity-100"
                          : "scale-0 opacity-0"
                      }`}
                    />
                  </div>
                  <div className="relative w-4 h-4 overflow-hidden">
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                        commentLiked ? "-translate-y-full" : "translate-y-0"
                      }`}
                    >
                      <span className="text-sm text-center text-gray-400 pl-[0.1em]">
                        {commentLikesCount}
                      </span>
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                        commentLiked ? "translate-y-0" : "translate-y-full"
                      }`}
                    >
                      <span className="text-sm text-center pl-[0.1em] text-[#49a4ff]">
                        {commentLikesCount}
                      </span>
                    </div>
                  </div>
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Comment;

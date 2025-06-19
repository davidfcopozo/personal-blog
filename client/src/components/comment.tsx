"use client";

import React, { MouseEvent, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Heart, MessageSquare } from "lucide-react";
import { getFullName, getNameInitials } from "@/utils/formats";
import { CommentProps } from "@/typings/types";
import useFetchRequest from "@/hooks/useFetchRequest";
import ContentRenderer from "@/components/ui/content-renderer";
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
import dynamic from "next/dynamic";
import useDeleteComment from "@/hooks/useDeleteComment";
import useUpdateComment from "@/hooks/useUpdateComment";
import RelativeTime from "./relative-time";
import { EngagementButton } from "./engagement-button";
import { AuthModal } from "./auth-modal";
import { useAuth } from "@/context/AuthContext";

const CommentEditor = dynamic(() => import("./comment-editor"), {
  ssr: false,
});

const Comment: React.FC<CommentProps> = ({ comment, post }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || "");

  const { currentUser } = useAuth();
  const { mutate: deleteComment } = useDeleteComment(post);
  const { mutate: updateComment, status: updateStatus } =
    useUpdateComment(post);

  // Check if current user is the owner of the comment
  const isCommentOwner =
    currentUser?.data?._id?.toString() === comment?.postedBy?.toString();

  const { data: postedBy } = useFetchRequest(
    ["commentPostedBy"],
    `/api/users/${comment?.postedBy}`
  );

  const {
    createReplyInteraction,
    replyContent,
    likeCommentInteraction,
    commentLiked,
    commentLikesCount,
    handleReplyContentChange,
    replyMutationStatus,
    // Auth modal properties
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
  } = useInteractions(post, comment);

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    likeCommentInteraction(`${comment._id}`, {
      onError: () => {
        console.error("Error handling like interaction");
      },
    });
  };
  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment?.content || "");
    setShowEditor(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment?.content || "");
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      return;
    }

    updateComment(
      {
        commentId: comment._id,
        content: editContent,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error) => {
          console.error("Error updating comment:", error);
        },
      }
    );
  };

  const handleEditContentChange = (content: string) => {
    setEditContent(content);
  };

  const handleReportAbuse = () => {
    // Implement report abuse functionality
    console.log("Report abuse");
  };
  const handleDelete = () => {
    if (!post?._id || !comment?._id) return;

    if (!comment.isReply) {
      deleteComment({
        url: `/api/comments/${post?._id}/${comment?._id}`,
        itemId: `${comment?._id}`,
        key: "comments",
      });
    } else {
      deleteComment({
        url: "",
        itemId: `${comment?._id}`,
        key: "replies",
        parentId: `${comment?.parentId}`,
      });
    }

    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = () => {
    createReplyInteraction({
      onError: () => {
        console.error("Error handling reply interaction");
      },
    });
    setShowEditor(false);
  };
  return (
    <>
      {isEditing ? (
        <CommentEditor
          onSubmit={handleSaveEdit}
          value={editContent}
          onChange={handleEditContentChange}
          onCancel={handleCancelEdit}
          showCancelButton={true}
          placeholder="Edit your comment..."
          commentMutationStatus={updateStatus}
          isEditing={true}
        />
      ) : (
        <article className="flex bg-background rounded-lg">
          <div
            id={`${comment?._id}`}
            className="flex flex-1 items-start gap-2 px-4 pb-2 pt-4 border-[1px] rounded-md"
          >
            <Avatar className="w-10 h-10 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{getNameInitials(postedBy?.data)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 flex-1">
              <div className="flex ml-2 items-center gap-2">
                <div className="font-medium">{getFullName(postedBy?.data)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <RelativeTime createdAt={comment?.createdAt} />
                </div>
                {currentUser && (isCommentOwner || !isCommentOwner) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-auto">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isCommentOwner && (
                        <DropdownMenuItem onClick={handleEdit}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {!isCommentOwner && (
                        <DropdownMenuItem onClick={handleReportAbuse}>
                          Report Abuse
                        </DropdownMenuItem>
                      )}
                      {isCommentOwner && (
                        <DropdownMenuItem
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <ContentRenderer
                content={comment.content || ""}
                className="ml-2"
              />
              <div className="h-content">
                <div className="flex items-center justify-end mr-4 gap-2 relative">
                  <EngagementButton
                    icon={MessageSquare}
                    count={comment?.replies.length}
                    iconStyles="hover:stroke-amber-500 !h-5 !w-5"
                    label="Reply"
                    onClick={() => setShowEditor((showEditor) => !showEditor)}
                    horizontalCount
                  />
                  <EngagementButton
                    icon={Heart}
                    count={commentLikesCount}
                    label="Like post"
                    onClick={handleLikeClick}
                    iconStyles={`!h-5 !w-5 ${
                      commentLiked ? "text-pink-500" : "hover:stroke-pink-500"
                    }`}
                    activeColor="text-pink-500"
                    isActivated={commentLiked}
                    horizontalCount
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      )}
      {showEditor && !isEditing && (
        <CommentEditor
          onSubmit={handleSubmit}
          value={replyContent}
          onChange={handleReplyContentChange}
          onCancel={() => setShowEditor(false)}
          showCancelButton={true}
          placeholder="Write a reply..."
          commentMutationStatus={replyMutationStatus}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-background border-none">
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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-foreground hover:bg-destructive hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={handleAuthSuccess}
        action={authModalAction}
      />
    </>
  );
};

export default Comment;

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
import { UserAvatar } from "./ui/user-avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

const CommentEditor = dynamic(() => import("./comment-editor"), {
  ssr: false,
});

const Comment: React.FC<CommentProps> = ({ comment, post }) => {
  const t = useTranslations("comments");
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

  const { data: postedBy, isLoading: isUserLoading } = useFetchRequest(
    ["users", comment?.postedBy],
    `/api/users/${comment?.postedBy}`,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
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
      {" "}
      {isEditing ? (
        <CommentEditor
          onSubmit={handleSaveEdit}
          value={editContent}
          onChange={handleEditContentChange}
          onCancel={handleCancelEdit}
          showCancelButton={true}
          placeholder={t("editCommentPlaceholder")}
          commentMutationStatus={updateStatus}
          isEditing={true}
          originalContent={comment?.content || ""}
        />
      ) : (
        <article className="flex bg-background rounded-lg">
          <div
            id={`${comment?._id}`}
            className="flex flex-1 items-start gap-2 px-4 pb-2 pt-4 border-[1px] rounded-md"
          >
            <Link
              href={`/${postedBy?.data?.username}`}
              className="flex-shrink-0"
            >
              <UserAvatar
                user={postedBy?.data}
                size="md"
                isLoading={isUserLoading}
              />
            </Link>
            <div className="grid gap-2 flex-1">
              <div className="flex ml-2 items-center gap-2">
                <Link
                  href={`/${postedBy?.data?.username}`}
                  className="font-medium text-foreground hover:text-[hsl(var(--thread-border))] transition-all duration-300"
                >
                  {getFullName(postedBy?.data)}
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <RelativeTime createdAt={comment?.createdAt} />
                </div>
                {currentUser && (isCommentOwner || !isCommentOwner) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-auto">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">{t("moreOptions")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isCommentOwner && (
                        <DropdownMenuItem onClick={handleEdit}>
                          {t("edit")}
                        </DropdownMenuItem>
                      )}
                      {!isCommentOwner && (
                        <DropdownMenuItem onClick={handleReportAbuse}>
                          {t("reportAbuse")}
                        </DropdownMenuItem>
                      )}
                      {isCommentOwner && (
                        <DropdownMenuItem
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          {t("delete")}
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
                    label={t("reply")}
                    onClick={() => setShowEditor((showEditor) => !showEditor)}
                    horizontalCount
                  />
                  <EngagementButton
                    icon={Heart}
                    count={commentLikesCount}
                    label={t("like")}
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
      )}{" "}
      {showEditor && !isEditing && (
        <CommentEditor
          onSubmit={handleSubmit}
          value={replyContent}
          onChange={handleReplyContentChange}
          onCancel={() => setShowEditor(false)}
          showCancelButton={true}
          placeholder={t("replyPlaceholder")}
          commentMutationStatus={replyMutationStatus}
          originalContent=""
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-background border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-foreground hover:bg-destructive hover:opacity-90"
            >
              {t("delete")}
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

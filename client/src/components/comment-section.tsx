import { CommentSectionPropsType } from "@/typings/types";
import CommentBox from "./comment-box";
import useBulkFetch from "@/hooks/useBulkFetch";
import { CommentInterface } from "@/typings/interfaces";
import NestedComment from "./nested-comments";
import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentSection({
  comments,
  post,
}: CommentSectionPropsType) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const { data: fetchedComments } = useBulkFetch({
    ids: comments?.length >= 1 ? comments : [],
    key: "comments",
    url: `/api/comments`,
  });

  const hash = window.location.hash;
  useEffect(() => {
    if (hash === "#comments-section") {
      const commentsSection = document.getElementById("comments-section");
      commentsSection?.scrollIntoView({ behavior: "smooth" });
      commentsSection?.focus();
    }
  }, [hash]);

  // Listen for new comments and replies for this post
  useEffect(() => {
    if (!socket || !post) return;

    const handleNewComment = (data: { postId: string; comment: any }) => {
      if (data.postId === post._id) {
        // Invalidate comments query to refetch and include the new comment
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    };

    const handleNewReply = (data: {
      postId: string;
      parentCommentId: string;
      reply: any;
    }) => {
      if (data.postId === post._id) {
        // Invalidate comments query to refetch and include the new reply
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    };

    socket.on("newComment", handleNewComment);
    socket.on("newReply", handleNewReply);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("newReply", handleNewReply);
    };
  }, [socket, post, queryClient]);

  return (
    <section className="comment-section w-full max-w-7xl px-4 space-y-6 mb-8 sm:px-0">
      <div className="space-y-4">
        <h2 id="comments-section" className="text-2xl font-bold">
          Comments
        </h2>
        <CommentBox post={post} />
        <div className="grid gap-6">
          {fetchedComments && fetchedComments.length >= 1 ? (
            fetchedComments
              .filter((comment: CommentInterface) => !comment.isReply)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((comment: CommentInterface) => (
                <NestedComment
                  key={`${comment._id}`}
                  comment={comment}
                  post={post}
                />
              ))
          ) : (
            <p>No comments yet, be the first!</p>
          )}
        </div>
      </div>
    </section>
  );
}

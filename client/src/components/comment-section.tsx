import { CommentSectionPropsType } from "@/typings/types";
import CommentBox from "./comment-box";
import useBulkFetch from "@/hooks/useBulkFetch";
import { CommentInterface } from "@/typings/interfaces";
import NestedComment from "./nested-comments";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentSection({
  comments,
  post,
}: CommentSectionPropsType) {
  const queryClient = useQueryClient();
  
  // Get comments from the cache directly
  const cachedComments = queryClient.getQueryData<CommentInterface[]>(["comments"]);

  // Fallback to useBulkFetch if no cached comments are available
  const { data: fetchedComments, isLoading } = useBulkFetch({
    ids: (!cachedComments || cachedComments.length === 0) && comments?.length >= 1 ? comments : [],
    key: "comments-fallback",
    url: `/comments`,
  });

  // Initialize the comments cache with fetched data
  useEffect(() => {
    if (fetchedComments && fetchedComments.length > 0 && (!cachedComments || cachedComments.length === 0)) {
      queryClient.setQueryData<CommentInterface[]>(["comments"], fetchedComments);
    }
  }, [fetchedComments, cachedComments, queryClient]);

  // Use cached comments if available, otherwise use fetched comments
  // Filter to only show comments for this specific post
  const allComments = cachedComments?.length ? cachedComments : fetchedComments;
  const displayComments = allComments?.filter((comment: CommentInterface) => 
    !comment.isReply && 
    (comment.post === post._id || comment.post?.toString() === post._id?.toString())
  );

  const hash = window.location.hash;
  useEffect(() => {
    if (hash === "#comments-section") {
      const commentsSection = document.getElementById("comments-section");
      commentsSection?.scrollIntoView({ behavior: "smooth" });
      commentsSection?.focus();
    }
  }, [hash]);

  return (
    <section className="comment-section w-full max-w-7xl px-4 space-y-6 mb-8 sm:px-0">
      <div className="space-y-4">
        <h2 id="comments-section" className="text-2xl font-bold">
          Comments
        </h2>
        <CommentBox post={post} />        <div className="grid gap-6">
          {displayComments && displayComments.length >= 1 ? (
            displayComments
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
          ) : isLoading ? (
            <p>Loading comments...</p>
          ) : (
            <p>No comments yet, be the first!</p>
          )}
        </div>
      </div>
    </section>
  );
}

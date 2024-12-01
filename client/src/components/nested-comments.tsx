import React, { useState, useEffect, FC } from "react";
import useBulkFetch from "@/hooks/useBulkFetch";
import { CommentInterface, NestedCommentProps } from "@/typings/interfaces";
import CommentSkeleton from "./comment-skeleton";
import Comment from "./comment";
import SingleCommentSkeleton from "./single-comment-skeleton";

const NestedComment: FC<NestedCommentProps> = ({
  comment,
  post,
  level = 0,
  onMaxNestingReached,
}) => {
  // State to track if this comment is expandable
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [childrenLoaded, setChildrenLoaded] = useState(false);

  const {
    data: fetchedReplies,
    isLoading,
    isFetching,
  } = useBulkFetch({
    ids: comment?.replies?.length >= 1 ? comment?.replies : [],
    key: `replies-${comment._id}`,
    url: `/api/replies/${post._id}/${comment?._id}`,
    // Only fetch if expanded or children not yet loaded
    dependantItem: isExpanded && !childrenLoaded,
  });

  useEffect(() => {
    if (fetchedReplies && fetchedReplies.length > 0) {
      setChildrenLoaded(true);
    }
  }, [fetchedReplies]);

  // Handler for expanding/collapsing nested comments
  const toggleExpand = () => {
    if (level >= 5) {
      onMaxNestingReached?.();
      return;
    }
    setIsExpanded(!isExpanded);
  };

  // If loading, show skeleton
  /*   if (isLoading || isFetching) {
    return <CommentSkeleton />;
  } */

  return (
    <article className={`space-y-4 relative group`}>
      <Comment key={`${comment._id}`} comment={comment} post={post} />

      {fetchedReplies && fetchedReplies.length > 0 && (
        <>
          {level < 2 || !isExpanded ? (
            <div
              className="space-y-4 pl-6 ml-1 border-l-2 border-muted-input group-hover:border-[--thread-border] transition-all 
      duration-300 
      ease-in-out"
            >
              {isLoading || isFetching ? (
                <SingleCommentSkeleton />
              ) : (
                fetchedReplies
                  .filter((reply: CommentInterface) => reply.isReply)
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((reply: CommentInterface) => (
                    <NestedComment
                      key={`${reply._id}`}
                      comment={reply}
                      post={post}
                      level={level + 1}
                      onMaxNestingReached={() => {
                        // Optional: Show a toast or provide user feedback
                      }}
                    />
                  ))
              )}
            </div>
          ) : (
            <button
              onClick={toggleExpand}
              className="text-[--thread-border] hover:underline mt-2"
            >
              Show {fetchedReplies?.length} more replies
            </button>
          )}
        </>
      )}
    </article>
  );
};

export default NestedComment;

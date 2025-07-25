import React, { useState, useEffect, FC } from "react";
import { CommentInterface, NestedCommentProps } from "@/typings/interfaces";
import Comment from "./comment";
import SingleCommentSkeleton from "./single-comment-skeleton";
import useFetchReplies from "@/hooks/useFetchReplies";
import { useTranslations } from "next-intl";

const NestedComment: FC<NestedCommentProps> = ({
  comment,
  post,
  level = 0,
  onMaxNestingReached,
}) => {
  const t = useTranslations("comments");
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [childrenLoaded, setChildrenLoaded] = useState(false);
  const { fetchedReplies, isLoading, isFetching } = useFetchReplies({
    ids: comment?.replies?.length >= 1 ? comment?.replies : [],
    key: `replies-${comment._id}`,
    url: `/replies/${post._id}/${comment?._id}`,
    isExpanded: isExpanded,
    childrenLoaded: !childrenLoaded,
    comment: comment,
  });

  useEffect(() => {
    if (fetchedReplies && fetchedReplies.length > 0) {
      setChildrenLoaded(true);
    }
  }, [fetchedReplies]);

  const toggleExpand = () => {
    if (level >= 5) {
      onMaxNestingReached?.();
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <article className={`space-y-4 relative group`}>
      <Comment key={`${comment._id}`} comment={comment} post={post} />

      {fetchedReplies && fetchedReplies.length > 0 && (
        <>
          {level < 2 || !isExpanded ? (
            <div className="space-y-4 pl-6 ml-1 border-l-2 border-muted-input group-hover:border-[hsl(var(--thread-border))] transition-all duration-300 ease-in-out">
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
                      onMaxNestingReached={() => {}}
                    />
                  ))
              )}
            </div>
          ) : (
            <button
              onClick={toggleExpand}
              className="text-[hsl(var(--thread-border))] hover:underline mt-2"
            >
              {t("showReplies")} ({fetchedReplies?.length})
            </button>
          )}
        </>
      )}
    </article>
  );
};

export default NestedComment;

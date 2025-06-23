import { CommentSectionPropsType } from "@/typings/types";
import CommentBox from "./comment-box";
import useBulkFetch from "@/hooks/useBulkFetch";
import { CommentInterface } from "@/typings/interfaces";
import NestedComment from "./nested-comments";
import { useEffect } from "react";

export default function CommentSection({
  comments,
  post,
}: CommentSectionPropsType) {
  const { data: fetchedComments } = useBulkFetch({
    ids: comments?.length >= 1 ? comments : [],
    key: "comments",
    url: `/comments`,
  });

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

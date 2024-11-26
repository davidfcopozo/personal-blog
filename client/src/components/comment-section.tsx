import { CommentSectionPropsType } from "@/typings/types";
import CommentBox from "./comment-box";
import useBulkFetch from "@/hooks/useBulkFetch";
import { CommentInterface } from "@/typings/interfaces";
import NestedComment from "./NestedComments";

export default function CommentSection({
  comments,
  id,
  post,
}: CommentSectionPropsType) {
  const { data: fetchedComments } = useBulkFetch({
    ids: comments?.length >= 1 ? comments : [],
    key: "comments",
    url: `/api/comments`,
  });

  return (
    <section className="w-full max-w-3xl px-4 mx-auto space-y-6 mb-8 sm:px-6">
      <div className="space-y-4">
        <h2 id="comments-section" className="text-2xl font-bold">
          Comments
        </h2>
        <CommentBox id={id} />
        <div className="grid gap-6">
          {fetchedComments && fetchedComments.length >= 1 ? (
            fetchedComments
              .filter((comment: CommentInterface) => !comment.isReply)
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

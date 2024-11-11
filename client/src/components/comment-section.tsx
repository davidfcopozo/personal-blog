import { CommentSectionPropsType } from "@/typings/types";
import Comment from "./comment";
import CommentBox from "./comment-box";
import useCommentFetch from "@/hooks/useCommentFetch";
import { CommentInterface } from "@/typings/interfaces";

export default function CommentSection({
  comments,
  id,
}: CommentSectionPropsType) {
  const { data: fetchedComments } = useCommentFetch(comments);

  return (
    <div className="w-full max-w-3xl px-4 mx-auto space-y-6 mb-8 sm:px-6">
      <div className="space-y-4">
        <h2 id="comments-section" className="text-2xl font-bold">
          Comments
        </h2>
        <div className="grid gap-6">
          {fetchedComments && fetchedComments.length >= 1 ? (
            fetchedComments?.map((comment: CommentInterface) => (
              <Comment key={`${comment?._id}`} comment={comment} />
            ))
          ) : (
            <p>No comments yet, be the first!</p>
          )}
        </div>
      </div>
      <CommentBox id={id} />
    </div>
  );
}

import { CommentSectionPropsType } from "@/typings/types";
import Comment from "./comment";
import CommentBox from "./comment-box";

export default function CommentSection({ comments }: CommentSectionPropsType) {
  console.log("comments", comments);

  return (
    <div className="w-full max-w-3xl px-4 mx-auto space-y-6 mb-8 sm:px-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="grid gap-6">
          {comments ? (
            comments.map((comment) => (
              <Comment key={`${comment._id}`} comment={comment} />
            ))
          ) : (
            <p>No comments yet, be the first!</p>
          )}
        </div>
      </div>
      <CommentBox />
    </div>
  );
}

import { useInteractions } from "@/hooks/useInteractions";
import dynamic from "next/dynamic";
const CommentEditor = dynamic(() => import("./comment-editor"), {
  ssr: false,
});

const CommentBox = ({ id }: { id: string }) => {
  const { createCommentInteraction, setCommentContent, commentContent } =
    useInteractions(id);

  const handleChange = (content: string) => {
    setCommentContent(content);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <h3 className="text-xl font-bold mb-4">Add a new comment</h3>
      <CommentEditor
        value={commentContent}
        onChange={handleChange}
        onSubmit={createCommentInteraction}
        onCancel={() => {}}
        showCancelButton={false}
        placeholder="Share your thoughts with the community..."
      />
    </form>
  );
};

export default CommentBox;

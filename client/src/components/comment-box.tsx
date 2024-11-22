import { useInteractions } from "@/hooks/useInteractions";
import dynamic from "next/dynamic";
const CommentEditor = dynamic(() => import("./comment-editor"), {
  ssr: false,
});

const CommentBox = ({ id }: { id: string }) => {
  const { createCommentInteraction, setContent, content } = useInteractions(id);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCommentInteraction({ onError: () => {} });
      }}
    >
      <h3 className="text-xl font-bold mb-4">Add a new comment</h3>
      <CommentEditor
        onSubmit={() => {}}
        onCancel={() => {}}
        showCancelButton={false}
        placeholder="Share your thoughts with the community..."
      />
    </form>
  );
};

export default CommentBox;

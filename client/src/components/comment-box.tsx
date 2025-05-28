import { useInteractions } from "@/hooks/useInteractions";
import { PostType } from "@/typings/types";
import dynamic from "next/dynamic";
import { AuthModal } from "./auth-modal";
const CommentEditor = dynamic(() => import("./comment-editor"), {
  ssr: false,
});

const CommentBox = ({ post }: { post: PostType }) => {
  const {
    createCommentInteraction,
    setCommentContent,
    commentContent,
    commentMutationStatus,
    // Auth modal properties
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
  } = useInteractions(post);

  const handleChange = (content: string) => {
    setCommentContent(content);
  };
  return (
    <>
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
          commentMutationStatus={commentMutationStatus}
          placeholder="Share your thoughts with the community..."
        />
      </form>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        action={authModalAction || "comment"}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CommentBox;

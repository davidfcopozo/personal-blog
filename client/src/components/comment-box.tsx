import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInteractions } from "@/hooks/useInteractions";

const CommentBox = ({ id }: { id: string }) => {
  const { createCommentInteraction, setContent, content } = useInteractions(id);
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        createCommentInteraction({ onError: () => {} });
      }}
    >
      <h3 className="text-xl font-bold">Add a new comment</h3>
      <Textarea
        placeholder="Write your comment here..."
        className="min-h-[100px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button>Submit</Button>
    </form>
  );
};

export default CommentBox;

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CommentBox = () => {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold">Add a new comment</h3>
      <Textarea
        placeholder="Write your comment here..."
        className="min-h-[100px]"
      />
      <Button>Submit</Button>
    </div>
  );
};

export default CommentBox;

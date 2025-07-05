import usePostRequest from "./usePostRequest";
import { useToast } from "@/components/ui/use-toast";

type SharePostVariables = {
  postId: string;
  shareType:
    | "native"
    | "facebook"
    | "x"
    | "linkedin"
    | "copy-link"
    | "whatsapp"
    | "email"
    | "other";
};

const useSharePost = () => {
  const { toast } = useToast();

  const { mutate, data, status, error } = usePostRequest({
    url: "/api/posts/share",
    onSuccess: (data, variables) => {
      const shareType = (variables as SharePostVariables)?.shareType;
      const shareTypeLabel =
        shareType === "copy-link" ? "link copied" : `shared on ${shareType}`;

      toast({
        title: "Success",
        description: `Post ${shareTypeLabel} successfully!`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to record share",
      });
    },
  });

  return { sharePost: mutate, data, status, error };
};

export default useSharePost;

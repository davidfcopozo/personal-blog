import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CommentInterface } from "@/typings/interfaces";
import { useEffect } from "react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
};

const useCommentFetch = (ids: string[]) => {
  const baseULR = getBaseURL();

  const fetchComments = async (): Promise<CommentInterface[]> => {
    const commentPromises = ids.map(async (id) => {
      const { data } = await axios.get<{
        success: boolean;
        data: CommentInterface;
      }>(`${baseULR}/api/comments/${id}`);
      return data.data;
    });

    const comments = await Promise.all(commentPromises);
    return comments;
  };

  const { data, error, isLoading, isFetching } = useQuery<CommentInterface[]>({
    queryKey: ["comments", ...ids],
    queryFn: fetchComments,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    gcTime: 0,
    staleTime: 0,
  });

  return { data, error, isLoading, isFetching };
};

export default useCommentFetch;

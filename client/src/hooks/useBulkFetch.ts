import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CommentInterface } from "@/typings/interfaces";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
};

interface UseBulkFetchProps {
  ids: string[];
  key: string;
  dependantId?: string;
  url: string;
}

const useBulkFetch = ({ ids, key, dependantId, url }: UseBulkFetchProps) => {
  const baseURL = getBaseURL();

  const fetchComments = async (): Promise<CommentInterface[]> => {
    if (!ids.length) return [];

    const commentPromises = ids.map(async (id) => {
      const { data } = await axios.get<{
        success: boolean;
        data: CommentInterface;
      }>(`${baseURL}/${url}/${id}`);
      return data.data;
    });

    const comments = await Promise.all(commentPromises);
    return comments;
  };

  const { data, error, isLoading, isFetching } = useQuery<CommentInterface[]>({
    queryKey: [key],
    queryFn: fetchComments,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    gcTime: 0,
    staleTime: 0,
    enabled: ids?.length > 0,
  });

  return { data, error, isLoading, isFetching };
};

export default useBulkFetch;

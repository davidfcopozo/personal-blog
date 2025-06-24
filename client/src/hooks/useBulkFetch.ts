import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CommentInterface, UseBulkFetchProps } from "@/typings/interfaces";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT ||
      `http://${window.location.hostname}:8000/api/v1`
    );
  }
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT ||
    "http://localhost:8000/api/v1"
  );
};

const useBulkFetch = ({ ids, key, dependantItem, url }: UseBulkFetchProps) => {
  const baseURL = getBaseURL();

  const fetchComments = async (): Promise<CommentInterface[]> => {
    if (!ids.length) return [];

    const commentPromises = ids.map(async (id) => {
      try {
        const { data } = await axios.get<{
          success: boolean;
          data: CommentInterface;
        }>(`${baseURL}${url}/${id}`);
        return data.data;
      } catch (error) {
        return null;
      }
    });

    const results = await Promise.all(commentPromises);
    return results.filter(
      (comment): comment is CommentInterface => comment !== null
    );
  };

  const { data, error, isLoading, isFetching } = useQuery<CommentInterface[]>({
    queryKey: [key, ids],
    queryFn: fetchComments,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: ids?.length > 0 || dependantItem,
    retry: (failureCount, error) => {
      if (
        error &&
        "response" in error &&
        (error as any).response?.status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return { data, error, isLoading, isFetching };
};

export default useBulkFetch;

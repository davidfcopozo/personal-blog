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
        // Log the error but don't fail the entire fetch
        console.warn(`Failed to fetch comment/reply ${id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(commentPromises);
    // Filter out null results (failed fetches)
    return results.filter(
      (comment): comment is CommentInterface => comment !== null
    );
  };
  const { data, error, isLoading, isFetching } = useQuery<CommentInterface[]>({
    queryKey: [key, ids], // Include ids in query key so it refetches when ids change
    queryFn: fetchComments,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 30 * 1000, // Reduce stale time to 30 seconds for more frequent updates
    enabled: ids?.length > 0 || dependantItem,
    retry: (failureCount, error) => {
      // Don't retry on 404s, but retry on network errors
      if (
        error &&
        "response" in error &&
        (error as any).response?.status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff with max 5s
  });

  return { data, error, isLoading, isFetching };
};

export default useBulkFetch;

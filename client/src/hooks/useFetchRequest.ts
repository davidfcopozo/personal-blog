import apiClient from "@/utils/axiosIntance";
import { useQuery } from "@tanstack/react-query";
import { getCachedRequest } from "@/utils/request-cache";

const useFetchRequest = (queryKey: any[], url: string | null, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!url) return null;

      return getCachedRequest(url, async () => {
        const response = await apiClient.get(url);
        return response.data;
      });
    },
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes default
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options, // Allow overriding defaults
  });
};

export default useFetchRequest;

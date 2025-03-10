import apiClient from "@/utils/axiosIntance";
import { useQuery } from "@tanstack/react-query";


const useFetchRequest = (queryKey: any[], url: string | null, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!url) return null;

      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: !!url,
    ...options,
  });
};

export default useFetchRequest;

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
};

const useFetchRequest = (queryKey: any[], url: string | null, options = {}) => {
  const baseULR = getBaseURL();
  const fullUrl = url ? `${baseULR}${url}` : null;

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!fullUrl) return null;

      const response = await axios.get(fullUrl);
      return response.data;
    },
    enabled: !!fullUrl,
    ...options,
  });
};

export default useFetchRequest;

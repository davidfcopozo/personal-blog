import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `http://${hostname}:3000`;
    } else {
      return `https://${hostname}`;
    }
  }
  return "http://localhost:3000";
};

const useFetchRequest = (queryKey: any[], url: string | null, options = {}) => {
  const baseURL = getBaseURL();
  const fullUrl = url ? `${baseURL}${url}` : null;

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

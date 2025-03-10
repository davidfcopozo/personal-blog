import getBaseURL from "@/utils/get-base-url";
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

  try {
    const fetchData = async () => {
      const { data } = await axios.get(`${baseULR}${url}`);
      return data;
    };

    const { data, error, isLoading, isFetching, refetch, isPending } = useQuery(
      {
        queryKey,
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        gcTime: 0,
        staleTime: 0,
      }
    );

    return { data, error, isLoading, isFetching, isPending, refetch };
  } catch (error: Error | any) {
    throw new Error(error);
  }
};

export default useFetchRequest;

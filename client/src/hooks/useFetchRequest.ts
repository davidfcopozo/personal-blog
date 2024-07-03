import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useFetchRequest(key: string, url: string) {
  const fetchCurrentUser = async () => {
    const { data } = await axios.get(url);
    return data;
  };

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [key],
    queryFn: fetchCurrentUser,
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading, isFetching, refetch };
}

export default useFetchRequest;

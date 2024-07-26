import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const baseULR = `http://${window.location.hostname}:3000`;

function useFetchRequest(key: string, url: string) {
  try {
    const fetchData = async () => {
      const { data } = await axios.get(`${baseULR}${url}`);

      return data;
    };

    const { data, error, isLoading, isFetching, refetch } = useQuery({
      queryKey: [key],
      queryFn: fetchData,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      gcTime: 0,
      staleTime: 0,
    });

    useEffect(() => {
      fetchData();
    }, []);

    return { data, error, isLoading, isFetching, refetch };
  } catch (error: Error | any) {
    throw new Error(error);
  }
}

export default useFetchRequest;

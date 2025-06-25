import useFetchRequest from "./useFetchRequest";

export function useUser(id: string) {
  return useFetchRequest(["users", id], `/api/users/${id}`, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id, // Only fetch if id exists
  });
}

import useFetchRequest from "./useFetchRequest";

export const useUserOwnPosts = (status?: string) => {
  const queryKey = status ? ["user-posts", status] : ["user-posts"];
  const endpoint = status
    ? `/api/posts/my-posts?status=${status}`
    : "/api/posts/my-posts";

  const { data, error, isLoading, isFetching, isPending } = useFetchRequest(
    queryKey,
    endpoint
  );

  return { data, error, isLoading, isFetching, isPending };
};

export default useUserOwnPosts;

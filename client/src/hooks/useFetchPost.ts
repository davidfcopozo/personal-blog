import useFetchRequest from "./useFetchRequest";

const useFetchPost = (slug: string) => {
  const { data, error, isLoading, isFetching, isPending } = useFetchRequest(
    ["post", slug],
    `/api/posts/${slug}`
  );

  return { data, error, isLoading, isFetching, isPending };
};

export default useFetchPost;

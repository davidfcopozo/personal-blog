import useFetchRequest from "./useFetchRequest";

const useFetchPost = (slug: string) => {
  const { data, error, isLoading, isFetching } = useFetchRequest(
    "posts",
    `/api/posts/${slug}`
  );

  return { data, error, isLoading, isFetching };
};

export default useFetchPost;

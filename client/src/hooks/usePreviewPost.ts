import useFetchRequest from "./useFetchRequest";

export const usePreviewPost = (slug: string) => {
  const { data, error, isLoading, isFetching, isPending } = useFetchRequest(
    ["preview-post", slug],
    `/api/posts/preview/${slug}`
  );

  return { data, error, isLoading, isFetching, isPending };
};

export default usePreviewPost;

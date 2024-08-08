import { useEffect } from "react";
import useFetchRequest from "./useFetchRequest";

const useFetchPost = (slug: string) => {
  const { data, error, isLoading } = useFetchRequest(
    "posts",
    `/api/posts/${slug}`
  );

  return { data, error, isLoading };
};

export default useFetchPost;

import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType } from "@/typings/types";

const currentUserPosts = (userId: string) => {
  const {
    data: posts,
    error: postsError,
    isFetching: arePostsFetching,
    isLoading: arePostsLoading,
  } = useFetchRequest(["posts"], `/api/posts`);

  const blogPosts = Array.isArray(posts?.data)
    ? posts.data
        .filter((post: PostType) => post?.postedBy?._id.toString() === userId)
        .sort(
          (a: PostType, b: PostType) =>
            new Date(String(b.createdAt ?? new Date())).getTime() -
            new Date(String(a.createdAt ?? new Date())).getTime()
        )
    : [];
  return { blogPosts, arePostsFetching, arePostsLoading, postsError };
};

export default currentUserPosts;

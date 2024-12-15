"use client";
import BlogPost from "@/components/blog-post";
import SinglePostSkeleton from "@/components/single-post-skeleton";
import useFetchPost from "@/hooks/useFetchPost";
import { useInteractions } from "@/hooks/useInteractions";
import { useEffect, useState } from "react";

const Blog = ({ params }: { params: { slug: string } }) => {
  const slug = decodeURI(params.slug);
  const { data, isFetching, isLoading } = useFetchPost(slug);
  const [hasInitialData, setHasInitialData] = useState(false);

  const {
    handleLikeClick,
    handleBookmarkClick,
    liked,
    bookmarked,
    amountOfBookmarks,
    amountOfLikes,
  } = useInteractions(data?.data);

  useEffect(() => {
    if (data?.data && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [data?.data, hasInitialData]);

  if (isLoading || (isFetching && !hasInitialData)) {
    return <SinglePostSkeleton />;
  }

  return (
    <div>
      <BlogPost
        slug={slug}
        handleLikeClick={handleLikeClick}
        handleBookmarkClick={handleBookmarkClick}
        liked={liked}
        bookmarked={bookmarked}
        amountOfBookmarks={amountOfBookmarks}
        amountOfLikes={amountOfLikes}
        post={data?.data}
      />
    </div>
  );
};

export default Blog;

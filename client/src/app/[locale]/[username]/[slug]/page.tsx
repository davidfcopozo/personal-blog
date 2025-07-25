"use client";
import BlogPost from "@/components/blog-post";
import SinglePostSkeleton from "@/components/single-post-skeleton";
import useFetchPost from "@/hooks/useFetchPost";
import { useInteractions } from "@/hooks/useInteractions";
import { AuthModal } from "@/components/auth-modal";
import { useEffect, useState, use } from "react";

const Blog = (props: { params: Promise<{ slug: string }> }) => {
  const params = use(props.params);
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
    // Auth modal properties
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        action={authModalAction || "like"}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Blog;

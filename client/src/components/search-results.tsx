import { PostType } from "@/typings/types";
import Link from "next/link";
import { memo } from "react";

const SearchResults = memo(
  ({
    filteredPosts,
    isFocused,
    searchQuery,
    onLinkClick,
  }: {
    filteredPosts: PostType[];
    isFocused: boolean;
    searchQuery: string;
    onLinkClick: (slug: string) => void;
  }) => {
    if (!filteredPosts?.length || !isFocused || !searchQuery) return null;

    return (
      <div className="absolute mt-4 bg-background rounded-md shadow-sm w-full">
        {filteredPosts.map((post: PostType) => (
          <Link
            key={post._id.toString()}
            href={`/blog/${post.slug}`}
            className="block px-4 py-3 hover:bg-muted/50 hover:rounded-lg transition-colors"
            prefetch={false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onLinkClick(post.slug as string)}
          >
            {post.title}
          </Link>
        ))}
      </div>
    );
  }
);

SearchResults.displayName = "SearchResults";

export default SearchResults;

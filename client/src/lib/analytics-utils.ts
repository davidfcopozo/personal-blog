import { PostType } from "@/typings/types";

// Generate daily views data for the last 30 days based on real post data
export const generateViewsTimelineData = (
  posts: PostType[],
  translateDay?: (dayNumber: number) => string
) => {
  const days = 30;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const postsPublishedByThisDate = posts.filter((post) => {
      const postDate = new Date(post.createdAt || new Date());
      return postDate <= date;
    });

    const totalViews = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.visits || 0),
      0
    );

    const dayNumber = days - i;
    data.push({
      day: translateDay ? translateDay(dayNumber) : `Day ${dayNumber}`,
      views: totalViews,
    });
  }

  return data;
};

// Generate engagement data for the last 15 days based on real post data
export const generateEngagementTimelineData = (
  posts: PostType[],
  translateDay?: (dayNumber: number) => string
) => {
  const days = 15;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const postsPublishedByThisDate = posts.filter((post) => {
      const postDate = new Date(post.createdAt || new Date());
      return postDate <= date;
    });

    const totalLikes = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.likesCount || 0),
      0
    );
    const totalComments = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    );
    const totalBookmarks = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.bookmarksCount || 0),
      0
    );
    const totalShares = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.sharesCount || 0),
      0
    );

    const dayNumber = days - i;
    data.push({
      day: translateDay ? translateDay(dayNumber) : `Day ${dayNumber}`,
      likes: totalLikes,
      comments: totalComments,
      bookmarks: totalBookmarks,
      shares: totalShares,
    });
  }

  return data;
};

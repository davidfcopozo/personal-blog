import { PostType } from "@/typings/types";

// Generate daily views data for the last 30 days based on post creation dates and visits
export const generateViewsTimelineData = (posts: PostType[]) => {
  const days = 30;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Calculate views for this day based on posts published before this date
    const postsPublishedByThisDate = posts.filter((post) => {
      const postDate = new Date(post.createdAt || new Date());
      return postDate <= date;
    });

    // Simulate daily views with some variance
    const totalViews = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.visits || 0),
      0
    );
    const dailyViews = Math.max(
      50,
      Math.floor(totalViews / 30 + Math.random() * 200 - 100)
    );

    data.push({
      day: `Day ${days - i}`,
      views: dailyViews,
    });
  }

  return data;
};

// Generate engagement data for the last 15 days
export const generateEngagementTimelineData = (posts: PostType[]) => {
  const days = 15;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Calculate engagement metrics for this day
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
    const totalShares = postsPublishedByThisDate.reduce(
      (sum, post) => sum + (post.sharesCount || 0),
      0
    );

    // Add some daily variance
    const likes = Math.max(
      5,
      Math.floor(totalLikes / 15 + Math.random() * 20 - 10)
    );
    const comments = Math.max(
      2,
      Math.floor(totalComments / 15 + Math.random() * 8 - 4)
    );
    const shares = Math.max(
      1,
      Math.floor(totalShares / 15 + Math.random() * 5 - 2)
    );

    data.push({
      day: `Day ${days - i}`,
      likes,
      comments,
      shares,
    });
  }

  return data;
};

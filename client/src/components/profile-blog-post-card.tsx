import { PostType } from "@/typings/types";
import Link from "next/link";
import { useState, useEffect } from "react";

const ProfileBlogPostCard = ({ post }: { post: PostType }) => {
  const { _id, title, visits, slug, postedBy } = post;
  const [formattedDate, setFormattedDate] = useState<string>("");

  const postUrl = postedBy?.username
    ? `/${postedBy.username}/${slug}`
    : `/posts/${slug}`;

  useEffect(() => {
    if (post?.createdAt) {
      setFormattedDate(
        new Date(post.createdAt.toString()).toLocaleDateString("en-US", { timeZone: "UTC" })
      );
    }
  }, [post?.createdAt]);

  return (
    <div key={_id.toString()} className="border-b pb-4 last:border-b-0">
      <Link href={postUrl} passHref>
        <h2 className="text-xl font-semibold hover:text-primary">{title}</h2>
      </Link>      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
        <span>{formattedDate}</span>
        <span>{visits as number} visits</span>
      </div>
    </div>
  );
};

export default ProfileBlogPostCard;

import { notFound } from "next/navigation";

interface UserPostPageProps {
  params: Promise<{
    locale: string;
    username: string;
    slug: string;
  }>;
}

export default async function UserPostPage({ params }: UserPostPageProps) {
  const { username, slug } = await params;

  // This would typically fetch post data
  // For now, we'll just display the username and slug
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Post by {username}</h1>
      <p>Post slug: {slug}</p>
      <p>
        This is a blog post by user: {username} with slug: {slug}
      </p>
    </div>
  );
}

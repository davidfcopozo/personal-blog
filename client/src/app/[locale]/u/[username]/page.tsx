import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    locale: string;
    username: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { username } = params;

  // This would typically fetch user data
  // For now, we'll just display the username
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">User Profile: {username}</h1>
      <p>This is the profile page for user: {username}</p>
    </div>
  );
}

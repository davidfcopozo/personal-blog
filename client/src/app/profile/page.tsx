import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { users, posts } from "@/lib/testDatabase.json";
import { getFullName, getNameInitials } from "@/lib/utils";
import ProfileBlogCard from "@/components/profile-blog-card";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="container mx-auto mt-12 px-4 py-12 md:px-6 lg:py-16">
      <div className="grid gap-12 md:grid-cols-[200px_1fr] lg:gap-16">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>{getNameInitials(users[0])}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-center">
            <h2 className="text-2xl font-bold">{getFullName(users[0])}</h2>
            <p className="text-muted-foreground">{users[0].title}</p>
          </div>
          <div className="gap-2 text-center">
            <p className="text-gray-500">{users[0]?.bio}</p>
            <Link href="#" className="text-gray-500">
              example.com
            </Link>
            <p className="text-gray-500">{users[0]?.email}</p>
            <p className="text-gray-500">@{users[0]?.username}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-2xl font-bold text-center md:text-start md:ml-6">
            Published Articles
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ProfileBlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

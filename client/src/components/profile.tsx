"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { posts } from "@/lib/testDatabase.json";
import { getFullName, getNameInitials } from "@/lib/utils";
import ProfileBlogCard from "@/components/profile-blog-card";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto mt-12 px-4 py-12 md:px-6 lg:py-16">
      <div className="grid gap-12 md:grid-cols-[200px_1fr] lg:gap-16">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={currentUser?.data?.avatar} />
            <AvatarFallback>{getNameInitials(currentUser)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-center" id="dsadasdsadsa">
            <h2 className="text-2xl font-bold">{getFullName(currentUser)}</h2>
            <p className="text-muted-foreground">{currentUser?.data?.title}</p>
          </div>
          <div className="gap-2 text-center">
            <p className="text-gray-500">{currentUser?.data?.bio}</p>
            <Link href="#" className="text-gray-500">
              example.com
            </Link>
            <p className="text-gray-500">{currentUser?.data?.email}</p>
            <p className="text-gray-500">@{currentUser?.data?.username}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-2xl font-bold text-center md:text-start md:ml-6">
            Published Articles
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ProfileBlogCard key={post._id + index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Github, Linkedin, Mail, X } from "lucide-react";
import { getFullName, getNameInitials } from "@/utils/formats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType, UserType } from "@/typings/types";
import ProfileBlogCard from "./profile-blog-post-card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const UserProfile = ({ user }: { user: UserType }) => {
  const [isOwner, setIsOwner] = useState(false);
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser?.data?._id.toString() === user?._id?.toString()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [currentUser]);

  const {
    data: posts,
    error: postsError,
    isFetching: arePostsFetching,
  } = useFetchRequest(["posts"], `/api/posts`);

  const blogPosts = Array.isArray(posts?.data)
    ? posts.data.filter(
        (post: PostType) =>
          post?.postedBy?._id.toString() === user._id?.toString()
      )
    : [];
  return (
    <div className="container mx-auto px-8 py-8 mt-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Blog Posts */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Published Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts &&
                  blogPosts
                    .sort(
                      (a: PostType, b: PostType) =>
                        new Date(String(b.createdAt ?? new Date())).getTime() -
                        new Date(String(a.createdAt ?? new Date())).getTime()
                    )
                    .map((post: PostType, index: number) => (
                      <ProfileBlogCard
                        post={post}
                        key={post?._id.toString() + index}
                      />
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Profile Information */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                {isOwner && (
                  <div className="w-full flex justify-end mb-4">
                    <Link href="/settings" passHref>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                )}
                <Avatar className="h-32 w-32 border-2 mb-4">
                  <AvatarImage
                    src={user?.avatar as string}
                    alt={getFullName(user)}
                  />
                  <AvatarFallback>{getNameInitials(user)}</AvatarFallback>
                </Avatar>
                <div>
                  <div>
                    <h1 className="text-2xl font-bold ">{getFullName(user)}</h1>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {user?.title}
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">{user?.bio}</p>
                {/* followers and follow button */}
                <div className="flex items-center mb-4 ">
                  <span className="text-xs text-muted-foreground mr-1">
                    {currentUser?.data?.followers?.length}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Followers
                  </span>
                </div>
                {/* Social media */}
                <div className="flex space-x-4 mb-4">
                  <Link href="#" passHref>
                    <Button variant="outline" size="icon">
                      <X className="h-4 w-4" />
                      <span className="sr-only">X</span>
                    </Button>
                  </Link>
                  <Link href="#" passHref>
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </Link>
                  <Link href="#" passHref>
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                  <Link href={`mailto:${user?.email}`} passHref>
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>React</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>Tailwind CSS</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

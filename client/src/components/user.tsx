import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getFullName, getNameInitials } from "@/utils/formats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePageSkeleton from "./profile-page-skeleton";
import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType } from "@/typings/types";
import ProfileBlogCard from "./profile-blog-card";

const User = ({ id }: { id: string }) => {
  const {
    data: userData,
    error: userError,
    isFetching: isUserFetching,
    isLoading: isUserLoading,
  } = useUser(id as string);
  const {
    data: posts,
    error: postsError,
    isFetching: arePostsFetching,
  } = useFetchRequest("posts", `/api/posts`);
  const user = userData?.data;
  const blogPosts = Array.isArray(posts?.data)
    ? posts.data.filter(
        (post: PostType) => post?.postedBy?._id.toString() === id.toString()
      )
    : [];
  return (
    <>
      {isUserFetching || isUserLoading ? (
        <ProfilePageSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 border-2 mb-4">
                      <AvatarImage
                        src={user?.avatar as string}
                        alt={getFullName(user)}
                      />
                      <AvatarFallback>{getNameInitials(user)}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold mb-2">
                      {getFullName(user)}
                    </h1>
                    <p className="text-muted-foreground text-center mb-4">
                      {user?.bio}
                    </p>
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
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <Badge>React</Badge>
                      <Badge>Next.js</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Node.js</Badge>
                      <Badge>Tailwind CSS</Badge>
                    </div>
                    <Link href={`mailto:${user?.email}`} passHref>
                      <Button className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Contact Me
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blog Posts */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Published Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts &&
                      blogPosts.map((post: PostType, index: number) => (
                        <ProfileBlogCard
                          post={post}
                          key={post?._id.toString() + index}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;

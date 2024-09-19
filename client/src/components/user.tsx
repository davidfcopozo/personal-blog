import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getFullName, getNameInitials } from "@/utils/formats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePageSkeleton from "./profile-page-skeleton";

const User = ({ id }: { id: string }) => {
  const { data, error, isFetching, isLoading } = useUser(id as string);
  const user = data?.data;
  return (
    <>
      {isFetching || isLoading ? (
        <ProfilePageSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    {/* <Image
                  src={user?.avatar as string}
                  alt="Profile Picture"
                  width={150}
                  height={150}
                  className="rounded-full mb-4"
                /> */}
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
                  {/* <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="border-b pb-4 last:border-b-0">
                    <Link href={`/blog/${post.id}`} passHref>
                      <h2 className="text-xl font-semibold hover:text-primary">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                      <span>{post.date}</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                ))}
              </div> */}
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

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Github, Linkedin, Mail, X, Dribbble } from "lucide-react";
import { getFullName, getNameInitials } from "@/utils/formats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetchRequest from "@/hooks/useFetchRequest";
import { PostType, UserType } from "@/typings/types";
import ProfileBlogCard from "./profile-blog-post-card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfilePageSkeleton from "./profile-page-skeleton";
import { useFollowUser } from "@/hooks/useFollowUser";
import { AuthModal } from "./auth-modal";

const UserProfile = ({
  user,
  isUserPending,
}: {
  user: UserType;
  isUserPending?: boolean;
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const { currentUser } = useAuth();
  const {
    handleFollowToggle,
    isPending,
    isFollowed,
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
  } = useFollowUser(user);

  useEffect(() => {
    if (currentUser?.data?._id.toString() === user?._id?.toString()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [currentUser, user?._id]);

  const { data: posts, isPending: arePostsPending } = useFetchRequest(
    ["posts"],
    `/api/posts`
  );

  const blogPosts = Array.isArray(posts?.data)
    ? posts.data.filter(
        (post: PostType) =>
          post?.postedBy?._id.toString() === user?._id?.toString()
      )
    : [];

  if (arePostsPending || isUserPending)
    return (
      <div className="container mx-auto px-8 py-8 mt-14">
        <ProfilePageSkeleton />
      </div>
    );

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
              <div className="flex flex-col ">
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
                <div className="flex items-center mb-4 gap-2">
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-muted-foreground mr-1">
                      {user?.followers?.length}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Followers
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    {!isOwner && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs">♦</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`outline-none px-0 text-xs  hover:bg-transparent hover:text-amber-500 ${
                            user?.followers?.some(
                              (id: any) =>
                                id.toString() ===
                                currentUser?.data?._id.toString()
                            )
                              ? "text-amber-500"
                              : ""
                          }`}
                          onClick={handleFollowToggle}
                          disabled={isPending}
                        >
                          {isFollowed ? "Following" : "Follow"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Social media */}
                <div className="flex gap-x-2 gap-y-2 lg:gap-y-0 mb-4 flex-wrap">
                  {user?.socialMediaProfiles?.x &&
                    user?.socialMediaProfiles?.x?.length > 0 && (
                      <Link
                        href={`https://x.com/${user?.socialMediaProfiles?.x}`}
                        target="_blank"
                        passHref
                      >
                        <Button variant="outline" size="icon">
                          <X className="h-4 w-4" />
                          <span className="sr-only">X</span>
                        </Button>
                      </Link>
                    )}

                  {user?.socialMediaProfiles?.github &&
                    user?.socialMediaProfiles?.github?.length > 0 && (
                      <Link
                        href={`https://github.com/${user?.socialMediaProfiles?.github}`}
                        target="_blank"
                        passHref
                      >
                        <Button variant="outline" size="icon">
                          <Github className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </Button>
                      </Link>
                    )}
                  {user?.socialMediaProfiles?.linkedIn &&
                    user?.socialMediaProfiles?.linkedIn?.length > 0 && (
                      <Link
                        href={`https://www.linkedin.com/in/${user?.socialMediaProfiles?.linkedIn}`}
                        target="_blank"
                        passHref
                      >
                        <Button variant="outline" size="icon">
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </Link>
                    )}
                  {user?.socialMediaProfiles?.dribble &&
                    user?.socialMediaProfiles?.dribble?.length > 0 && (
                      <Link
                        href={`https://dribbble.com/${user?.socialMediaProfiles?.dribble}`}
                        target="_blank"
                        passHref
                      >
                        <Button variant="outline" size="icon">
                          <Dribbble className="h-4 w-4" />
                          <span className="sr-only">Dribble</span>
                        </Button>
                      </Link>
                    )}
                  {user?.email && user?.email.length > 0 && (
                    <Link href={`mailto:${user?.email}`} passHref>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {user?.technologies?.map((tech: any) => (
                    <Badge key={tech._id}>{tech.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>{" "}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        action={authModalAction || "follow"}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default UserProfile;

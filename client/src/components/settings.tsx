"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFullName, getNameInitials } from "@/utils/formats";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Settings = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col mt-16 md:mt-12 min-h-[100dvh]">
      <div className="container mx-auto px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
          <div className="col-span-1 md:col-span-1">
            <div className="bg-background shadow-md rounded-lg p-6">
              <div className="flex flex-col items-center justify-center mb-4">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg font-bold">
                    {getNameInitials(currentUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2 ">
                  <Button variant="default">Change picture</Button>
                  <Button type="button" variant="outline">
                    Delete picture
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">
                  {getFullName(currentUser)}
                </h2>
                <p className="text-gray-500 mb-2">
                  @{currentUser?.data?.username}
                </p>
                <p className="text-gray-500 mb-2">{currentUser?.data?.email}</p>
                {/* Add website to the user model and types */}
                <Link href="" className="text-gray-500 mb-2">
                  {currentUser?.data?.website}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-2">
            <div className="bg-background shadow-md rounded-lg p-6">
              <form>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      defaultValue={currentUser?.data?.firstName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      defaultValue={currentUser?.data?.lastName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={currentUser?.data?.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      defaultValue={currentUser?.data?.username}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    defaultValue={currentUser?.data?.bio}
                  />
                </div>
                <div className="mt-6">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    defaultValue={currentUser?.data?.website}
                  />
                </div>
                <div className="flex pt-4 justify-start">
                  <Button>Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

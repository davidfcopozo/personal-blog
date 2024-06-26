import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFullName, getNameInitials } from "@/lib/utils";
import { users } from "@/lib/testDatabase.json";
import Link from "next/link";

export const Settings = () => {
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
                    {getNameInitials(users[0])}
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
                  {getFullName(users[0])}
                </h2>
                <p className="text-gray-500 mb-2">@{users[0]?.username}</p>
                <p className="text-gray-500 mb-2">{users[0]?.email}</p>
                {/* Add website to the user model and types */}
                <Link href="" className="text-gray-500 mb-2">
                  https://example.com
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
                      defaultValue={users[0]?.firstName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      defaultValue={users[0]?.lastName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={users[0]?.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      defaultValue={users[0]?.username}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} defaultValue={users[0]?.bio} />
                </div>
                <div className="mt-6">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    defaultValue="https://example.com"
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

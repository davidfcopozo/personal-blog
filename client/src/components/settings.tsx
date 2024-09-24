"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFullName, getNameInitials } from "@/utils/formats";
import { useAuth } from "@/context/AuthContext";
import SkillsForm from "./skills-form";
import InterestForm from "./interests-form";
import SocialsForm from "./socials-form";
import PersonalInfoForm from "./personal-info-form";
import { FormEvent } from "react";

export const Settings = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate an API call
    setTimeout(() => {
      // If successful, redirect to the profile page
      router.push("/profile");
    }, 1000);
  };

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
                <Link href="" className="text-gray-500 mb-2">
                  {currentUser?.data?.website}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-2">
            <div className="bg-background shadow-md rounded-lg p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="custom">Custom Experience</TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                  <TabsContent value="personal">
                    <PersonalInfoForm currentUser={currentUser?.data} />
                  </TabsContent>
                  <TabsContent value="social">
                    <SocialsForm />
                  </TabsContent>
                  <TabsContent value="custom">
                    <div className="space-y-4">
                      <SkillsForm />
                      <InterestForm />
                    </div>
                  </TabsContent>
                  <div className="flex pt-4 justify-start">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

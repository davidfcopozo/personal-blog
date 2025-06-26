"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFullName, getNameInitials } from "@/utils/formats";
import SocialsForm from "./socials-form";
import PersonalInfoForm from "./personal-info-form";
import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import SkillsInterestsManager from "./SkillsInterestsManager";
import { SettingsSkeleton } from "./settings-skeleton";
import { Card } from "./ui/card";
import { UserAvatar } from "./ui/user-avatar";

export const Settings = () => {
  const {
    formData,
    handleFieldChange,
    handleSocialMediaChange,
    handleSubmit,
    userData,
    isUserPending,
  } = useUpdateSettings();

  if (isUserPending) return <SettingsSkeleton />;

  return (
    <div className="flex flex-col mt-16 md:mt-12 min-h-[100dvh]">
      <div className="container mx-auto px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
          {/* Tabs Section */}
          <div className="col-span-2 md:col-span-2">
            <Card className="bg-background shadow-md rounded-lg p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="custom">Custom Experience</TabsTrigger>
                </TabsList>
                <form onSubmit={handleSubmit}>
                  {/* Personal Info Tab */}
                  <TabsContent value="personal">
                    <PersonalInfoForm
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      isPending={isUserPending}
                    />
                  </TabsContent>
                  {/* Social Media Tab */}
                  <TabsContent value="social">
                    <SocialsForm
                      formData={formData}
                      handleSocialMediaChange={handleSocialMediaChange}
                      handleFieldChange={handleFieldChange}
                    />
                  </TabsContent>
                  {/* Custom Experience Tab */}
                  <TabsContent value="custom">
                    <div className="space-y-4">
                      <SkillsInterestsManager
                        items={formData.skills}
                        setItems={(value) => handleFieldChange("skills", value)}
                        label="Skills"
                        placeholder="Search for skills..."
                        fetchUrl="categories"
                      />
                      <SkillsInterestsManager
                        items={formData.interests}
                        setItems={(value) =>
                          handleFieldChange("interests", value)
                        }
                        label="Interests"
                        placeholder="Search for interests..."
                        fetchUrl="topics"
                      />
                    </div>
                  </TabsContent>
                  <div className="flex pt-4 justify-start">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Tabs>
            </Card>
          </div>
          {/* User Info Section */}
          <div className="col-span-1 md:col-span-1">
            <Card className="bg-background shadow-md rounded-lg p-4">
              <div className="flex flex-col items-center justify-center mb-4">
                <UserAvatar
                  user={userData}
                  size="xl"
                  className="mb-4"
                  isLoading={isUserPending}
                />
                <div className="flex flex-col space-y-2 ">
                  <Button variant="default">Change picture</Button>
                  <Button type="button" variant="outline">
                    Delete picture
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">
                  {getFullName(userData)}
                </h2>
                <p className="text-gray-500 mb-2">@{userData?.username}</p>
                <p className="text-gray-500 mb-2">{userData?.email}</p>
                <Link href="" className="text-gray-500 mb-2">
                  {userData?.website}
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

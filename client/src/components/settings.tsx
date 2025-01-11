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

export const Settings = () => {
  const {
    formData,
    handleFieldChange,
    handleSocialMediaChange,
    handleSubmit,
    userData,
    status,
  } = useUpdateSettings();

  return (
    <div className="flex flex-col mt-16 md:mt-12 min-h-[100dvh]">
      <div className="container mx-auto px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
          {/* User Info Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-background shadow-md rounded-lg p-6">
              <div className="flex flex-col items-center justify-center mb-4">
                <Avatar className="h-48 w-48 mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg font-bold">
                    {getNameInitials(userData)}
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
                  {getFullName(userData)}
                </h2>
                <p className="text-gray-500 mb-2">@{userData?.username}</p>
                <p className="text-gray-500 mb-2">{userData?.email}</p>
                <Link href="" className="text-gray-500 mb-2">
                  {userData?.website}
                </Link>
              </div>
            </div>
          </div>
          {/* Tabs Section */}
          <div className="col-span-2 md:col-span-2">
            <div className="bg-background shadow-md rounded-lg p-6">
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
                      isPending={status === "pending"}
                    />
                  </TabsContent>
                  {/* Social Media Tab */}
                  <TabsContent value="social">
                    <SocialsForm
                      currentUser={userData}
                      website={formData.website as string}
                      setWebsite={(value) =>
                        handleFieldChange("website", value)
                      }
                      twitterHandle={formData.socialMediaProfiles?.x as string}
                      setTwitterHandle={(value) =>
                        handleSocialMediaChange("x", value)
                      }
                      instagramHandle={
                        formData.socialMediaProfiles?.instagram as string
                      }
                      setInstagramHandle={(value) =>
                        handleSocialMediaChange("instagram", value)
                      }
                      githubHandle={
                        formData.socialMediaProfiles?.github as string
                      }
                      setGithubHandle={(value) =>
                        handleSocialMediaChange("github", value)
                      }
                      linkedinHandle={
                        formData.socialMediaProfiles?.linkedIn as string
                      }
                      setLinkedinHandle={(value) =>
                        handleSocialMediaChange("linkedIn", value)
                      }
                      dribbleHandle={
                        formData.socialMediaProfiles?.dribble as string
                      }
                      setDribbleHandle={(value) =>
                        handleSocialMediaChange("dribble", value)
                      }
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

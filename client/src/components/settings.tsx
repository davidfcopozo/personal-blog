"use client";
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
import { useUpdateSettings } from "@/hooks/useUpdateSettings";

export const Settings = () => {
  const { currentUser } = useAuth();

  const {
    handleSubmit,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    twitterHandle,
    setTwitterHandle,
    instagramHandle,
    setInstagramHandle,
    githubHandle,
    setGithubHandle,
    linkedinHandle,
    setLinkedinHandle,
    dribbleHandle,
    setDribbleHandle,
    skills,
    setSkills,
    interests,
    setInterests,
  } = useUpdateSettings();

  return (
    <div className="flex flex-col mt-16 md:mt-12 min-h-[100dvh]">
      <div className="container mx-auto px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
          <div className="col-span-1 md:col-span-1">
            <div className="bg-background shadow-md rounded-lg p-6">
              <div className="flex flex-col items-center justify-center mb-4">
                <Avatar className="h-48 w-48 mb-4">
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
                <form
                  onSubmit={(e) =>
                    handleSubmit(e, {
                      firstName,
                      lastName,
                      email,
                      username,
                      bio,
                      socialMediaProfiles: {
                        x: twitterHandle,
                        instagram: instagramHandle,
                        github: githubHandle,
                        linkedIn: linkedinHandle,
                        dribble: dribbleHandle,
                      },
                      skills,
                      interests,
                      website,
                    })
                  }
                >
                  <TabsContent value="personal">
                    <PersonalInfoForm
                      currentUser={currentUser?.data}
                      firstName={firstName}
                      setFirstName={setFirstName}
                      lastName={lastName}
                      setLastName={setLastName}
                      email={email}
                      setEmail={setEmail}
                      username={username as string}
                      setUsername={setUsername}
                      bio={bio as string}
                      setBio={setBio}
                    />
                  </TabsContent>
                  <TabsContent value="social">
                    <SocialsForm
                      currentUser={currentUser?.data}
                      website={website}
                      setWebsite={setWebsite}
                      twitterHandle={twitterHandle}
                      setTwitterHandle={setTwitterHandle}
                      instagramHandle={instagramHandle}
                      setInstagramHandle={setInstagramHandle}
                      githubHandle={githubHandle}
                      setGithubHandle={setGithubHandle}
                      linkedinHandle={linkedinHandle}
                      setLinkedinHandle={setLinkedinHandle}
                      dribbleHandle={dribbleHandle}
                      setDribbleHandle={setDribbleHandle}
                    />
                  </TabsContent>
                  <TabsContent value="custom">
                    <div className="space-y-4">
                      <SkillsForm setSkills={setSkills} skills={skills} />
                      <InterestForm
                        setInterests={setInterests}
                        interests={interests}
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

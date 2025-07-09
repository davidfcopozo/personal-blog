"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFullName } from "@/utils/formats";
import SocialsForm from "./socials-form";
import PersonalInfoForm from "./personal-info-form";
import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import SkillsInterestsManager from "./SkillsInterestsManager";
import { SettingsSkeleton } from "./settings-skeleton";
import { Card } from "./ui/card";
import { UserAvatar } from "./ui/user-avatar";
import { useImageManager } from "@/hooks/useImageManager";
import { useToast } from "@/components/ui/use-toast";
import { ImageUploadModal } from "./image-upload-modal";
import { UserType } from "@/typings/types";
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate";

export const Settings = () => {
  const {
    formData,
    handleFieldChange,
    handleSocialMediaChange,
    handleSubmit,
    userData,
    isUserPending,
    refetchUser,
  } = useUpdateSettings();

  const { toast } = useToast();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [localUserData, setLocalUserData] = useState<
    UserType | null | undefined
  >(userData);
  const [pendingAvatarUpdate, setPendingAvatarUpdate] = useState<string | null>(
    null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  const {
    uploadImage,
    deleteImage,
    updateImageMetadata,
    userImages,
    isLoadingImages,
    uploading,
  } = useImageManager();

  const { changeAvatar, deleteAvatar, isUpdating } = useAvatarUpdate(
    userData?._id
  );

  useEffect(() => {
    if (!isUpdating) {
      setIsUploadingAvatar(false);
      setIsDeletingAvatar(false);
    }
  }, [isUpdating]);

  const handleImageSelect = (imageUrl: string) => {
    console.log("handleImageSelect - setting avatar to:", imageUrl);

    setLocalUserData((prev) => {
      const newData = prev ? { ...prev, avatar: imageUrl } : prev;
      return newData;
    });

    setIsUploadingAvatar(true);

    changeAvatar(imageUrl);
    setIsImageModalOpen(false);
  };

  const handleChangePicture = () => {
    setIsImageModalOpen(true);
  };

  const handleDeletePicture = () => {
    if (!userData?.avatar) {
      toast({
        variant: "destructive",
        title: "No picture to delete",
        description: "You don't have a profile picture set",
      });
      return;
    }

    setPendingAvatarUpdate("");

    setLocalUserData((prev) => {
      const newData = prev ? { ...prev, avatar: undefined } : prev;
      return newData;
    });

    setIsDeletingAvatar(true);
    deleteAvatar();
  };

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
                  user={localUserData || userData}
                  size="xl"
                  className="mb-4"
                  isLoading={isUserPending}
                />
                <div className="flex flex-col space-y-2 ">
                  <Button
                    variant="default"
                    onClick={handleChangePicture}
                    disabled={
                      uploading || isUploadingAvatar || isDeletingAvatar
                    }
                  >
                    {uploading
                      ? "Uploading..."
                      : isUploadingAvatar
                      ? "Updating..."
                      : "Change picture"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeletePicture}
                    disabled={
                      uploading ||
                      isUploadingAvatar ||
                      isDeletingAvatar ||
                      !userData?.avatar
                    }
                  >
                    {isDeletingAvatar ? "Deleting..." : "Delete picture"}
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">
                  {getFullName(localUserData || userData)}
                </h2>
                <p className="text-gray-500 mb-2">
                  @{(localUserData || userData)?.username}
                </p>
                <p className="text-gray-500 mb-2">
                  {(localUserData || userData)?.email}
                </p>
                {(localUserData || userData)?.website && (
                  <Link
                    href={
                      (localUserData || userData)?.website?.startsWith("http")
                        ? (localUserData || userData)?.website || ""
                        : `https://${(localUserData || userData)?.website}`
                    }
                    className="text-blue-500 hover:text-blue-700 underline mb-2 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {(localUserData || userData)?.website}
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isImageUploadModalOpen={isImageModalOpen}
        openImageUploadModal={() => setIsImageModalOpen(!isImageModalOpen)}
        onInsertImage={handleImageSelect}
        handleImageUpload={uploadImage}
        images={userImages}
        onDeleteImage={deleteImage}
        onUpdate={updateImageMetadata}
        isLoadingImages={isLoadingImages}
        buttonText="Set as Profile Picture"
      />
    </div>
  );
};

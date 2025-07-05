import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import usePatchRequest from "./usePatchRequest";
import { useAuth } from "@/context/AuthContext";
import { InputFieldsProps, UserType } from "@/typings/types";

export const useUpdateSettings = () => {
  const { refetchUser, currentUser, isUserPending } = useAuth();
  const id = currentUser?.data?._id;
  const userData = currentUser?.data;

  const [formData, setFormData] = useState<InputFieldsProps>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    bio: "",
    website: "",
    socialMediaProfiles: {
      x: "",
      instagram: "",
      github: "",
      linkedIn: "",
      dribble: "",
    },
    skills: [],
    interests: [],
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        username: userData.username || "",
        bio: userData.bio || "",
        website: userData.website || "",
        socialMediaProfiles: {
          x: userData.socialMediaProfiles?.x || "",
          instagram: userData.socialMediaProfiles?.instagram || "",
          github: userData.socialMediaProfiles?.github || "",
          linkedIn: userData.socialMediaProfiles?.linkedIn || "",
          dribble: userData.socialMediaProfiles?.dribble || "",
        },
        skills: userData.technologies || [],
        interests: userData.topicsOfInterest || [],
      });
    }
  }, [userData, currentUser]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, status, error } = usePatchRequest({
    url: `/api/users/${id}`,
    onSuccess: (updatedUserData: UserType) => {
      toast({
        variant: "default",
        title: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      refetchUser();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Please try again",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const handleFieldChange = (field: keyof InputFieldsProps, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (
    platform: keyof UserType["socialMediaProfiles"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialMediaProfiles: {
        ...prev.socialMediaProfiles,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!userData) return;

    const fieldsToUpdate: Partial<InputFieldsProps> = {};

    if (formData.firstName !== (userData.firstName || "")) {
      fieldsToUpdate.firstName = formData.firstName;
    }
    if (formData.lastName !== (userData.lastName || "")) {
      fieldsToUpdate.lastName = formData.lastName;
    }
    if (formData.email !== (userData.email || "")) {
      fieldsToUpdate.email = formData.email;
    }
    if (formData.username !== (userData.username || "")) {
      fieldsToUpdate.username = formData.username;
    }
    if (formData.bio !== (userData.bio || "")) {
      fieldsToUpdate.bio = formData.bio;
    }
    if (formData.website !== (userData.website || "")) {
      fieldsToUpdate.website = formData.website;
    }

    const currentSocials = userData.socialMediaProfiles || {};
    const formSocials = formData.socialMediaProfiles || {};

    const socialMediaChanged =
      formSocials.x !== (currentSocials.x || "") ||
      formSocials.instagram !== (currentSocials.instagram || "") ||
      formSocials.github !== (currentSocials.github || "") ||
      formSocials.linkedIn !== (currentSocials.linkedIn || "") ||
      formSocials.dribble !== (currentSocials.dribble || "");

    if (socialMediaChanged) {
      // Filter socialMediaProfiles to remove empty or whitespace-only values
      const filteredSocialMediaProfiles = Object.fromEntries(
        Object.entries(formSocials).filter(
          ([_, value]) =>
            value && typeof value === "string" && value.trim() !== ""
        )
      );
      fieldsToUpdate.socialMediaProfiles = filteredSocialMediaProfiles;
    }

    const currentSkills = userData.technologies || [];
    const currentInterests = userData.topicsOfInterest || [];

    const skillsChanged =
      JSON.stringify(formData.skills.map((s) => s._id).sort()) !==
      JSON.stringify(currentSkills.map((s: any) => s._id).sort());
    const interestsChanged =
      JSON.stringify(formData.interests.map((i) => i._id).sort()) !==
      JSON.stringify(currentInterests.map((i: any) => i._id).sort());

    if (skillsChanged) {
      fieldsToUpdate.skills = formData.skills;
    }
    if (interestsChanged) {
      fieldsToUpdate.interests = formData.interests;
    }

    // Only submit if there are fields to update
    if (Object.keys(fieldsToUpdate).length > 0) {
      mutate(fieldsToUpdate);
    } else {
      toast({
        variant: "default",
        title: "No changes detected",
        description: "Make some changes before saving",
      });
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSocialMediaChange,
    handleSubmit,
    userData,
    status,
    isUserPending,
    refetchUser,
  };
};

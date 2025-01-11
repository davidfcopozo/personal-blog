import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import usePatchRequest from "./usePatchRequest";
import { useAuth } from "@/context/AuthContext";
import { InputFieldsProps } from "@/typings/types";

export const useUpdateSettings = () => {
  const { refetchUser, currentUser } = useAuth();
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
  }, [userData]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, status, error } = usePatchRequest({
    url: `/api/users/${id}`,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      refetchUser();
      setFormData({
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
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Please try again",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onMutate: async (updatedData: InputFieldsProps) => {
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      const previousData = queryClient.getQueryData(["currentUser"]);
      queryClient.setQueryData(["currentUser"], (oldData: any) => ({
        ...(oldData as object),
        ...updatedData,
      }));
      return { previousData };
    },
  });

  const handleFieldChange = (field: keyof InputFieldsProps, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
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

    // Filter socialMediaProfiles to remove empty or whitespace-only values
    const filteredSocialMediaProfiles =
      formData.socialMediaProfiles &&
      typeof formData.socialMediaProfiles === "object"
        ? Object.fromEntries(
            Object.entries(formData.socialMediaProfiles).filter(
              ([_, value]) =>
                value && typeof value === "string" && value.trim() !== ""
            )
          )
        : {};

    const fieldsToUpdate: InputFieldsProps = {
      ...formData,
      skills: formData?.skills,
      interests: formData?.interests,
    };

    for (const key in formData) {
      if (key === "socialMediaProfiles") {
      } else if (!formData[key as keyof InputFieldsProps]) {
        // Remove empty values
        delete fieldsToUpdate[key as keyof InputFieldsProps];
      }
    }

    if (Object.keys(filteredSocialMediaProfiles).length > 0) {
      fieldsToUpdate.socialMediaProfiles = filteredSocialMediaProfiles;
    }

    // Only submit if there are fields to update
    if (Object.keys(fieldsToUpdate).length > 0) {
      mutate(fieldsToUpdate);
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSocialMediaChange,
    handleSubmit,
    userData,
    status,
  };
};

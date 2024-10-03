import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import useUpdateRequest from "./useUpdateRequest";
import { useAuth } from "@/context/AuthContext";

export const useUpdateSettings = (id: string) => {
  /* Personal info */
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  /* Social */
  const [website, setWebsite] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  const [dribbleHandle, setDribbleHandle] = useState("");
  /* Custom */
  const [skills, setSkills] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { refetchUser } = useAuth();

  const { mutate, data, status, error } = useUpdateRequest({
    url: `/api/users/${id}`,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "User updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
        exact: true,
      });
      refetchUser();
      setFirstName("");
      setLastName("");
      setEmail;
      setUsername("");
      setBio("");
      setWebsite("");
      setTwitterHandle("");
      setInstagramHandle("");
      setGithubHandle("");
      setLinkedinHandle("");
      setDribbleHandle("");
      setSkills([]);
      setInterests([]);
    },
    onError: () => {
      console.log("error from useUpdateSettings===>", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error?.message || "Please try again",
      });
      const previousPosts = queryClient.getQueryData(["currentUser"]);
      queryClient.setQueryData(["currentUser"], previousPosts);
    },
    onMutate: async (user: any) => {
      console.log("user from onMutate===>", user);

      await queryClient.cancelQueries({
        queryKey: ["currentUser"],
        exact: true,
      });
      const previousUserData = queryClient.getQueryData(["currentUser"]);

      queryClient.setQueryData(["currentUser"], (oldData: any | undefined) => ({
        ...user,
        ...oldData,
      }));
      return previousUserData;
    },
  });
  const handleSubmit = (e: FormEvent, inputFields: any) => {
    e.preventDefault();

    let fieldsToUpdate: {
      title: string;
      content: string;
      featureImage: string;
      [key: string]: any;
    } = {
      title: "",
      content: "",
      featureImage: "",
    };
    for (const key in inputFields) {
      if (key === "skills" || key === "interests") {
        if (Array.isArray(inputFields[key]) && inputFields[key].length > 0) {
          fieldsToUpdate[key] = inputFields[key];
        }
      } else if (inputFields[key]) {
        fieldsToUpdate[key] = inputFields[key];
      }
    }

    if (Object.keys(fieldsToUpdate).length < 1) return;

    mutate(fieldsToUpdate);
  };

  return {
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
    handleSubmit,
  };
};

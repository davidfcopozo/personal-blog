import { FormEvent, useState } from "react";

export const useUpdateSettings = () => {
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

  const handleSubmit = (e: FormEvent, inputFields: any) => {
    console.log("submitting form===>", inputFields);

    e.preventDefault();

    let fieldsToUpdate: { [key: string]: any } = {};
    for (const key in inputFields) {
      if (inputFields[key]) {
        fieldsToUpdate[key] = inputFields[key];
      }
    }
    return console.log(fieldsToUpdate);
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

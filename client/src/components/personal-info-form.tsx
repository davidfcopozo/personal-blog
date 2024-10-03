"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfoFormProps } from "@/typings/types";

const PersonalInfoForm = ({
  currentUser,
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
}: PersonalInfoFormProps) => {
  if (!currentUser) {
    return (
      <div className="space-y-4 text-center">Loading user information...</div>
    );
  }
  const {
    firstName: currentFirstName,
    lastName: currentLastName,
    email: currentEmail,
    username: currentUsername,
    bio: currentBio,
  } = currentUser;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="font-bold">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            value={firstName ? firstName : (currentFirstName as string)}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="font-bold">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName ? lastName : (currentLastName as string)}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="font-bold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email ? email : (currentEmail as string)}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="username" className="font-bold">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username ? username : (currentUsername as string)}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="bio" className="font-bold">
          Bio
        </Label>
        <Textarea
          id="bio"
          rows={4}
          value={bio ? bio : (currentBio as string)}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;

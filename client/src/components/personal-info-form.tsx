"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfoFormProps } from "@/typings/types";

const PersonalInfoForm = ({
  formData,
  handleFieldChange,
  isPending,
}: PersonalInfoFormProps) => {
  if (isPending) {
    return (
      <div className="space-y-4 text-center">Loading user information...</div>
    );
  }
  const { firstName, lastName, email, username, bio } = formData;
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
            value={firstName as string}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="font-bold">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName as string}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
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
          value={email as string}
          onChange={(e) => handleFieldChange("email", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="username" className="font-bold">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={username as string}
          onChange={(e) => handleFieldChange("username", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="bio" className="font-bold">
          Bio
        </Label>
        <Textarea
          id="bio"
          rows={4}
          value={bio as string}
          onChange={(e) => handleFieldChange("bio", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;

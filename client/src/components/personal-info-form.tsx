"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserType } from "@/typings/types";

const PersonalInfoForm = ({ currentUser }: { currentUser: UserType }) => {
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
            defaultValue={currentUser?.firstName as string}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="font-bold">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            defaultValue={currentUser?.lastName as string}
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
          defaultValue={currentUser?.email as string}
        />
      </div>
      <div>
        <Label htmlFor="username" className="font-bold">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          defaultValue={currentUser?.username as string}
        />
      </div>
      <div>
        <Label htmlFor="bio" className="font-bold">
          Bio
        </Label>
        <Textarea id="bio" rows={4} defaultValue={currentUser?.bio as string} />
      </div>
    </div>
  );
};

export default PersonalInfoForm;

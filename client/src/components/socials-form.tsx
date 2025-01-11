"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialsFormProps } from "@/typings/types";

const SocialsForm = ({
  formData,
  handleSocialMediaChange,
  handleFieldChange,
}: SocialsFormProps) => {
  const { website } = formData;
  const { socialMediaProfiles } = formData;
  const { x, instagram, github, linkedIn, dribble } = socialMediaProfiles || {};

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="website" className="font-bold">
          Website
        </Label>
        <Input
          id="website"
          type="text"
          onChange={(e) => handleFieldChange("website", e.target.value)}
          value={website as string}
        />
      </div>
      <div>
        <Label htmlFor="twitter" className="font-bold">
          Twitter Handle
        </Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            @
          </span>
          <Input
            id="twitter"
            value={x as string}
            onChange={(e) => handleSocialMediaChange("x", e.target.value)}
            className="rounded-l-none"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instagram" className="font-bold">
          Instagram Handle
        </Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            @
          </span>
          <Input
            id="instagram"
            value={instagram as string}
            onChange={(e) =>
              handleSocialMediaChange("instagram", e.target.value)
            }
            className="rounded-l-none"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="github" className="font-bold">
          GitHub Handle
        </Label>
        <Input
          id="github"
          value={github as string}
          onChange={(e) => handleSocialMediaChange("github", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="linkedIn" className="font-bold">
          LinkedIn Handle
        </Label>
        <Input
          id="linkedIn"
          value={linkedIn as string}
          onChange={(e) => handleSocialMediaChange("linkedIn", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="dribble" className="font-bold">
          Dribble Handle
        </Label>
        <Input
          id="dribble"
          value={dribble as string}
          onChange={(e) => handleSocialMediaChange("dribble", e.target.value)}
        />
      </div>
    </div>
  );
};

export default SocialsForm;

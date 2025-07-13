"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialsFormProps } from "@/typings/types";
import { useTranslations } from "next-intl";

const SocialsForm = ({
  formData,
  handleSocialMediaChange,
  handleFieldChange,
}: SocialsFormProps) => {
  const t = useTranslations("settings");
  const { website } = formData;
  const { socialMediaProfiles } = formData;
  const { x, instagram, github, linkedIn, dribble } = socialMediaProfiles || {};

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="website" className="font-bold">
          {t("website")}
        </Label>
        <Input
          id="website"
          type="text"
          onChange={(e) => handleFieldChange("website", e.target.value)}
          value={website as string}
        />
      </div>
      <div>
        <Label htmlFor="x" className="font-bold">
          {t("xHandle")}
        </Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            @
          </span>
          <Input
            id="x"
            value={x as string}
            onChange={(e) => handleSocialMediaChange("x", e.target.value)}
            className="rounded-l-none"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instagram" className="font-bold">
          {t("instagramHandle")}
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
          {t("githubHandle")}
        </Label>
        <Input
          id="github"
          value={github as string}
          onChange={(e) => handleSocialMediaChange("github", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="linkedIn" className="font-bold">
          {t("linkedinHandle")}
        </Label>
        <Input
          id="linkedIn"
          value={linkedIn as string}
          onChange={(e) => handleSocialMediaChange("linkedIn", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="dribble" className="font-bold">
          {t("dribbbleHandle")}
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

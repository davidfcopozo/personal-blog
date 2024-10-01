"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialsFormProps } from "@/typings/types";

const SocialsForm = ({
  currentUser,
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
}: SocialsFormProps) => {
  const { website: currentWebsite } = currentUser;
  const { socialMediaProfiles } = currentUser;
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
          onChange={(e) => setWebsite(e.target.value)}
          value={website ? website : (currentWebsite as string)}
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
            value={twitterHandle ? twitterHandle : (x as string)}
            onChange={(e) => setTwitterHandle(e.target.value)}
            className="rounded-l-none"
            defaultValue={x as string}
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
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            className="rounded-l-none"
            defaultValue={instagram as string}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="github" className="font-bold">
          GitHub Handle
        </Label>
        <Input
          id="github"
          value={githubHandle}
          onChange={(e) => setGithubHandle(e.target.value)}
          defaultValue={github as string}
        />
      </div>
      <div>
        <Label htmlFor="linkedin" className="font-bold">
          LinkedIn Handle
        </Label>
        <Input
          id="linkedin"
          value={linkedinHandle}
          onChange={(e) => setLinkedinHandle(e.target.value)}
          defaultValue={linkedIn as string}
        />
      </div>
      <div>
        <Label htmlFor="dribble" className="font-bold">
          Dribble Handle
        </Label>
        <Input
          id="dribble"
          value={dribbleHandle}
          onChange={(e) => setDribbleHandle(e.target.value)}
          defaultValue={dribble as string}
        />
      </div>
    </div>
  );
};

export default SocialsForm;

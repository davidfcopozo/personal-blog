"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SocialsForm = () => {
  const { currentUser } = useAuth();
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [linkedinHandle, setLinkedinHandle] = useState("");
  const [dribbleHandle, setDribbleHandle] = useState("");
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="website" className="font-bold">
          Website
        </Label>
        <Input
          id="website"
          type="text"
          defaultValue={currentUser?.data?.website}
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
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
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
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
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
          value={githubHandle}
          onChange={(e) => setGithubHandle(e.target.value)}
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
        />
      </div>
    </div>
  );
};

export default SocialsForm;

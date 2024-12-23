import React from "react";
import { Github, XIcon, Linkedin, Globe } from "lucide-react";
import Image from "next/image";
import { AuthorPanelProps, SocialMediaConfig } from "@/typings/interfaces";

const socialMediaConfig: Record<string, SocialMediaConfig> = {
  x: {
    icon: XIcon,
    getUrl: (username: string) => `https://twitter.com/${username}`,
    label: "Twitter Profile",
  },
  github: {
    icon: Github,
    getUrl: (username: string) => `https://github.com/${username}`,
    label: "GitHub Profile",
  },
  linkedin: {
    icon: Linkedin,
    getUrl: (username: string) => `https://linkedin.com/in/${username}`,
    label: "LinkedIn Profile",
  },
  website: {
    icon: Globe,
    getUrl: (url: string) => (url.startsWith("http") ? url : `https://${url}`),
    label: "Personal Website",
  },
};

export function AuthorPanel({
  firstName,
  lastName,
  avatar,
  bio,
  website,
  title,
  socialMedia,
}: AuthorPanelProps) {
  const fullName = `${firstName} ${lastName}`;

  const availableSocialMedia = [
    // Only add website if it exists
    ...(website ? [{ type: "website" as const, username: website }] : []),
    // Filter out social media profiles that exist
    ...Object.entries(socialMedia || {})
      // Only include if username exists
      .filter(([_, username]) => username)
      .map(([type, username]) => ({
        type: type as keyof typeof socialMediaConfig,
        username,
      })),
  ];
  return (
    <article
      className="w-full lg:w-72 p-6 bg-muted shadow-sm rounded-lg"
      aria-labelledby="author-name"
    >
      <header className="flex flex-col items-center text-center">
        <figure className="mb-4">
          <Image
            src={avatar}
            alt={`${fullName}'s profile picture`}
            className="w-24 h-24 rounded-full"
            width={500}
            height={500}
            style={{ objectFit: "cover" }}
          />
        </figure>
        <h1 id="author-name" className="text-xl font-semibold text-foreground">
          {fullName}
        </h1>
        {title && (
          <p
            className="text-sm text-muted-foreground mt-1"
            aria-label="Professional title"
          >
            {title}
          </p>
        )}
      </header>

      {bio && (
        <section aria-label="Biography" className="mt-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </section>
      )}

      {availableSocialMedia.length > 0 && (
        <nav aria-label="Social media profiles" className="mb-6">
          <ul className="flex gap-4 justify-center">
            {availableSocialMedia.map(({ type, username }) => {
              if (!socialMediaConfig[type]) return null;

              const { icon: Icon, getUrl, label } = socialMediaConfig[type];

              return (
                <li key={type}>
                  <a
                    href={getUrl(username as string)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={`Visit ${fullName}'s ${label}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <footer>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label={`Follow ${fullName}`}
        >
          Follow
        </button>
      </footer>
    </article>
  );
}

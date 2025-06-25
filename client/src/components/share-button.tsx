import React, { useEffect, memo, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Facebook, Twitter, Linkedin, Mail, Link } from "lucide-react";
import { Share2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { PostType } from "@/typings/types";

export const ShareButton = memo(function ShareButton({
  post,
}: {
  post: PostType;
}) {
  const { toast } = useToast();

  const [shareUrl, setShareUrl] = React.useState("");

  const postSlug = useMemo(() => post.slug, [post.slug]);

  useEffect(() => {
    setShareUrl(`${window.location.origin}/blog/${postSlug}`);
  }, [postSlug]);

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(fbShareUrl, "_blank");
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => {
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          post.title
        )}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterShareUrl, "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => {
        const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(linkedinShareUrl, "_blank");
      },
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(
          `Check out this post: ${post.title}`
        );
        const body = encodeURIComponent(
          `I thought you might find this interesting:\n\n${post.title}\n\nRead more here: ${shareUrl}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
    {
      name: "Copy Link",
      icon: Link,
      action: () => {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            toast({
              description: "Link copied to clipboard",
            });
          })
          .catch(() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to copy link to clipboard",
            });
          });
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center justify-center text-gray-400 hover:text-[#1d9bf0] p-2 rounded-lg transition-colors duration-200 outline-none">
          <Share2 className="h-5 w-5" />
          <span className="text-xs mt-1">Share</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onSelect={(e) => {
              e.preventDefault();
              option.action();
            }}
            className="pointer-events-pointer hover:bg-[rgba(29,155,240,0.6)]"
          >
            <option.icon className="mr-2 h-4 w-4" />
            <span>Share on {option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

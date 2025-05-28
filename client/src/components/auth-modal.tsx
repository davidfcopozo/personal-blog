"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  Bookmark,
  MessageSquare,
  UserPlus,
  LogIn,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { GitHubIcon2, GoogleIcon2 } from "./icons";

export type AuthAction = "like" | "bookmark" | "comment" | "follow" | "reply";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: AuthAction;
  onSuccess?: () => void;
}

const actionConfig = {
  like: {
    icon: Heart,
    title: "Like this post",
    description:
      "Join the community to like posts and engage with content you love.",
    actionText: "liking",
  },
  bookmark: {
    icon: Bookmark,
    title: "Save this post",
    description:
      "Create an account to bookmark posts and build your personal reading list.",
    actionText: "bookmarking",
  },
  comment: {
    icon: MessageSquare,
    title: "Join the conversation",
    description:
      "Sign in to comment and share your thoughts with the community.",
    actionText: "commenting",
  },
  follow: {
    icon: UserPlus,
    title: "Follow this author",
    description:
      "Create an account to follow authors and stay updated with their latest posts.",
    actionText: "following authors",
  },
  reply: {
    icon: MessageSquare,
    title: "Reply to comment",
    description: "Sign in to reply to comments and join the discussion.",
    actionText: "replying to comments",
  },
};

export function AuthModal({
  isOpen,
  onClose,
  action,
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const { socialLogin } = useAuth();
  const { toast } = useToast();
  const config = actionConfig[action];
  const IconComponent = config.icon;

  const handleSignIn = () => {
    onClose();
    router.push("/login");
  };

  const handleRegister = () => {
    onClose();
    router.push("/register");
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      await socialLogin(provider);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      toast({
        title: "Welcome!",
        description:
          "You've successfully signed in. You can now perform this action.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "There was an error signing you in. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => handleSocialLogin("google")}
              variant="outline"
              className="w-full"
            >
              <GoogleIcon2 />
              Continue with Google
            </Button>

            <Button
              onClick={() => handleSocialLogin("github")}
              variant="outline"
              className="w-full"
            >
              <GitHubIcon2 />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Email/Password Login */}
          <div className="space-y-2">
            <Button onClick={handleSignIn} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with email
            </Button>

            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Create new account
            </Button>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

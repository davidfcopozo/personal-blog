"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "./icons";
import usePostRequest from "@/hooks/usePostRequest";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tForms = useTranslations("forms");
  const tAuthModal = useTranslations("authModal");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: tAuth("signInError"),
          description: tAuth("invalidCredentials"),
        });

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: tAuth("signInError"),
        description: tAuth("genericSignInError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setOauthLoading(provider);

      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: tAuth("signInError"),
        description: tAuthModal("socialSignInError", { provider }),
      });
      setOauthLoading(null);
    }
  };

  const { mutate: forgotPasswordMutation } = usePostRequest({
    url: "/api/auth/forgot-password",
    onSuccess: () => {
      toast({
        title: tAuth("forgotPasswordSent"),
        description: tAuth("forgotPasswordInstructions"),
      });
    },
    onError: (error) => {
      console.error("Password reset request error:", error);
      toast({
        variant: "destructive",
        title: "Could not process request",
        description: "Please try again later",
      });
    },
  });

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        variant: "destructive",
        title: tAuth("emailRequired"),
        description: tAuth("forgotPasswordEmailRequired"),
      });
      return;
    }

    try {
      setIsLoading(true);
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_API_ENDPOINT;
      await forgotPasswordMutation({
        email: formData.email,
        frontendUrl,
      });
      toast({
        title: tAuth("forgotPasswordSent"),
        description: tAuth("forgotPasswordInstructions"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-8 mb-4">
      <CardHeader>
        <CardTitle className="text-2xl">{tAuth("signIn")}</CardTitle>
        <CardDescription>{tAuth("loginFormDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth Providers */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            disabled={!!oauthLoading}
            onClick={() => handleOAuthSignIn("github")}
            className="flex items-center justify-center gap-2"
          >
            {oauthLoading === "github" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            {tAuth("signInWithGitHub")}
          </Button>
          <Button
            variant="outline"
            disabled={!!oauthLoading}
            onClick={() => handleOAuthSignIn("google")}
            className="flex items-center justify-center gap-2"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {tAuth("signInWithGoogle")}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {tCommon("orContinueWith")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{tAuth("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={tForms("emailPlaceholder")}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{tAuth("password")}</Label>
              <Button
                variant="link"
                className="ml-auto text-sm p-0 h-auto"
                onClick={handleForgotPassword}
                type="button"
              >
                {tAuth("forgotPassword")}
              </Button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder={tForms("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !!oauthLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tAuth("signingIn")}
              </>
            ) : (
              <>{tAuth("signInWithEmail")}</>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-center text-sm w-full">
          {tAuth("dontHaveAccount")}{" "}
          <Link href="/register" className="underline hover:text-primary">
            {tAuth("createAccount")}{" "}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

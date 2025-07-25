"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { useTranslations } from "next-intl";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tForms = useTranslations("forms");
  const tAuthModal = useTranslations("authModal");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName) return tAuthModal("firstNameRequired");
    if (!formData.lastName) return tAuthModal("lastNameRequired");
    if (!formData.username) return tAuthModal("usernameRequired");
    if (!formData.email) return tAuthModal("emailRequired");
    if (!formData.password) return tAuthModal("passwordRequired");
    if (formData.password.length < 8) return tAuthModal("passwordMinLength");
    if (formData.password !== formData.confirmPassword)
      return tAuthModal("passwordsMismatch");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return tAuthModal("invalidEmailFormat");

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast({
        title: tAuth("signUpSuccess"),
        description: tAuthModal("accountCreated", { action: tAuth("signIn") }),
      });

      // Automatically sign in
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
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || tAuthModal("registrationFailed"));
      toast({
        variant: "destructive",
        title: tAuth("signUpError"),
        description: err.message || tAuth("genericSignInError"),
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
      console.error(`OAuth error with ${provider}:`, error);
      toast({
        variant: "destructive",
        title: tAuth("signUpError"),
        description: tAuthModal("socialSignInError", { provider }),
      });
      setOauthLoading(null);
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-8 mb-4">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {tAuthModal("registerTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {tAuthModal("registerDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* OAuth Providers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {tAuth("signInWithGoogle")}
          </Button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {tCommon("orContinueWith")} {tAuthModal("createAccount")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{tAuth("firstName")}</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder={tForms("firstNamePlaceholder")}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{tAuth("lastName")}</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder={tForms("lastNamePlaceholder")}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{tAuth("username")}</Label>
            <Input
              id="username"
              name="username"
              placeholder={tForms("usernamePlaceholder")}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{tAuth("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={tForms("registerEmailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{tAuth("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={tForms("createPasswordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{tAuth("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={tForms("confirmPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isLoading || !!oauthLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tAuthModal("creatingAccount")}
              </>
            ) : (
              tAuthModal("createAccount")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          {tAuth("alreadyHaveAccount")}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            {" "}
            {tAuth("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

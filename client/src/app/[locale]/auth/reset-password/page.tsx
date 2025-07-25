"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"; // Remove useSearchParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import usePostRequest from "@/hooks/usePostRequest";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = use(props.searchParams);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("auth.resetPassword");

  const token = searchParams.token as string;
  const email = searchParams.email as string;

  const baseUrl = `${process.env.NEXT_PUBLIC_FRONTEND_API_ENDPOINT}/api`;

  const { mutate: verifyToken } = usePostRequest({
    url: "/api/auth/verify-reset-token",
    onSuccess: () => {
      setTokenValid(true);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Token verification error:", error);
      toast({
        variant: "destructive",
        title: t("invalidResetLinkToast"),
        description: error.message || t("invalidResetToastDescription"),
      });
      setIsLoading(false);
    },
  });

  const { mutate: resetPassword } = usePostRequest({
    url: "/api/auth/reset-password",
    onSuccess: () => {
      setSuccess(true);
      toast({
        title: t("resetSuccessToast"),
        description: t("resetSuccessToastDescription"),
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error) => {
      setError(error.message || t("failedToResetPassword"));
      toast({
        variant: "destructive",
        title: t("resetFailedToast"),
        description: error.message || t("somethingWentWrong"),
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    async function checkToken() {
      if (!token || !email) {
        toast({
          variant: "destructive",
          title: t("invalidResetLinkToast"),
          description: t("missingParametersToast"),
        });
        router.push("/login");
        return;
      }

      verifyToken({ token, email, baseUrl });
    }

    checkToken();
  }, [token, email, router, toast, baseUrl, verifyToken, t]);

  const validatePassword = () => {
    try {
      if (password.length < 8) {
        throw new Error(t("passwordMinLength"));
      }

      if (password !== confirmPassword) {
        throw new Error(t("passwordMismatchError"));
      }

      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        throw new Error(t("passwordComplexity"));
      }
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return t("unknownError");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    resetPassword({
      token,
      email,
      password,
      baseUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("verifyingResetLink")}</CardTitle>
            <CardDescription>{t("verifyingDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>{t("invalidResetLink")}</CardTitle>
            <CardDescription>{t("invalidResetDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">{t("backToLogin")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("resetSuccessful")}</CardTitle>
            <CardDescription>{t("resetSuccessDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">{t("backToLogin")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("resetYourPassword")}</CardTitle>
          <CardDescription>{t("enterNewPassword")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">{t("newPassword")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("enterNewPasswordPlaceholder")}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t("passwordRequirements")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("confirmNewPasswordPlaceholder")}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("resettingPassword")}
                </>
              ) : (
                t("resetPasswordButton")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/login">{t("backToLogin")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

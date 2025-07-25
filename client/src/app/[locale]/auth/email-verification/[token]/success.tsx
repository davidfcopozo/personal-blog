"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function VerificationSuccess() {
  const { currentUser } = useAuth();
  const t = useTranslations("auth.emailVerification");

  const isAlreadyVerified = currentUser?.data?.verified;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isAlreadyVerified
                ? t("alreadyVerifiedTitle")
                : t("emailVerifiedTitle")}
            </CardTitle>
            <CardDescription className="text-base">
              {isAlreadyVerified
                ? t("alreadyVerifiedDescription")
                : t("emailVerifiedDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {isAlreadyVerified
                ? t("alreadyVerifiedInfo")
                : t("emailVerifiedInfo")}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            {!currentUser?.data && (
              <Button asChild className="w-full">
                <Link href="/login">{t("loginToAccount")}</Link>
              </Button>
            )}
            <Button variant="outline" asChild className="w-full">
              <Link href="/">{t("exploreBlogPosts")}</Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            {t("needHelp")}{" "}
            <Link
              href="/support"
              className="font-medium text-primary hover:underline"
            >
              {t("contactSupport")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

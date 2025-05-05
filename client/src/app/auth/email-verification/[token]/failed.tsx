"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
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

interface VerificationErrorProps {
  message: string;
}

export default function VerificationError({ message }: VerificationErrorProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    error?: string;
    success?: string;
  }>({});
  const { currentUser } = useAuth();

  const isAlreadyVerified = currentUser?.data?.verified;

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendStatus({});

      const email = new URLSearchParams(window.location.search).get("email");
      if (!email) {
        throw new Error("Email not found in URL");
      }

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setResendStatus({
        success: "Verification email has been resent to your inbox",
      });
    } catch (error: any) {
      setResendStatus({
        error: error.message || "Failed to resend verification email",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2 text-center">
            <div className="rounded-full bg-red-100 p-3">
              {!isAlreadyVerified ? (
                <XCircle className="h-12 w-12 text-red-600" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isAlreadyVerified ? "Already Verified!" : "Verification Failed"}
            </CardTitle>
            <CardDescription
              className={`text-base ${
                !isAlreadyVerified ? "text-red-600" : "text-green-600"
              }`}
            >
              {isAlreadyVerified
                ? "Your email address is already verified."
                : message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {resendStatus.success ? (
              <p className="text-green-600">{resendStatus.success}</p>
            ) : resendStatus.error ? (
              <p className="text-red-600">{resendStatus.error}</p>
            ) : (
              <p className="text-muted-foreground">
                {isAlreadyVerified
                  ? "You already have full access to all features of our blog platform."
                  : "Please try verifying your email again or request a new verification link."}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            {!currentUser?.data && (
              <Button variant="default" asChild className="w-full">
                <Link href="/login">Log in to your account</Link>
              </Button>
            )}
            {!isAlreadyVerified && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending || !!resendStatus.success}
                className="w-full"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            )}
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <Link
              href="/support"
              className="font-medium text-primary hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

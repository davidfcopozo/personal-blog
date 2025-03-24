"use client";

import { useState, useEffect } from "react";
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

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
        title: "Invalid reset link",
        description:
          error.message || "The password reset link is invalid or has expired",
      });
      setIsLoading(false);
    },
  });

  const { mutate: resetPassword } = usePostRequest({
    url: "/api/auth/reset-password",
    onSuccess: () => {
      setSuccess(true);
      toast({
        title: "Password reset successful",
        description:
          "Your password has been reset. You can now log in with your new password.",
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error) => {
      setError(error.message || "Failed to reset password");
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message || "Something went wrong",
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    async function checkToken() {
      if (!token || !email) {
        toast({
          variant: "destructive",
          title: "Invalid reset link",
          description: "The password reset link is missing required parameters",
        });
        router.push("/login");
        return;
      }

      verifyToken({ token, email, baseUrl });
    }

    checkToken();
  }, [token, email, router, toast, baseUrl, verifyToken]);

  const validatePassword = () => {
    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        throw new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred";
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
            <CardTitle>Verifying reset link</CardTitle>
            <CardDescription>
              Please wait while we verify your password reset link
            </CardDescription>
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
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request
              a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
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
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been reset successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
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
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include uppercase,
                lowercase, and number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

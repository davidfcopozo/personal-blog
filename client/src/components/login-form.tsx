"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();
  const { login, socialLogin } = useAuth();
  const { toast } = useToast();
  const [errorParameter, setErrorParameter] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const errorFromParam = params.get("error");
      if (errorFromParam) {
        setErrorParameter(decodeURIComponent(errorFromParam));
      }
    }
  }, []);

  useEffect(() => {
    if (errorParameter && toast) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: decodeURIComponent(errorParameter as string),
      });
    }
  }, [errorParameter, toast]);

  const handleClientLogin = async (provider: string) => {
    try {
      const res = socialLogin(provider as "google" | "github");

      if (res !== undefined) {
        route.push("/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please try again.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error.message === "CredentialsSignin"
            ? "Invalid email or password"
            : error.message,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm mt-8 mb-4 sm:mb-4 ">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-foreground">
              Login
            </Button>
            <div className="flex flex-col text-center gap-2">
              <p>Or</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => handleClientLogin("github")}
              >
                Login with GitHub
                <span className="sr-only">Sign up with Google GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => handleClientLogin("google")}
              >
                Login with Google
                <span className="sr-only">Sign up with Google button</span>
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

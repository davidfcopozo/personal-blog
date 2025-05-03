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

export default function VerificationSuccess() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-base">
              Your account has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Thank you for verifying your email address. You now have full
              access to all features of our blog platform.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button asChild className="w-full">
              <Link href="/login">Log in to your account</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Explore blog posts</Link>
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

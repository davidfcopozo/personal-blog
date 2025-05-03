"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerificationError(

) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2 text-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-base">
              We couldn&#39;t verify your account.
            </CardDescription>
          </CardHeader>
          {/*   <CardContent className="text-center">
            <p className="text-muted-foreground">
              {error.message ||
                "The verification link may have expired or is invalid. Please try again."}
            </p>
          </CardContent> */}
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button asChild className="w-full">
              <Link href="/resend-verification">Resend verification email</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/support">Contact support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

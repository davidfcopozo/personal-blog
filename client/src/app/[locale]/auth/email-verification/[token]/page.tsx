"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import VerificationError from "./failed";
import VerificationLoading from "./loader";
import VerificationSuccess from "./success";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

const Page = () => {
  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const params = useParams();
  const searchParams = useSearchParams();
  const { isLoading } = useAuth();
  const t = useTranslations("auth.emailVerification");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = params.token as string;
        const email = searchParams.get("email");

        if (!token || !email) {
          setErrorMessage(t("invalidLink"));
          setVerificationState("error");
          return;
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("verificationFailed"));
        }

        setVerificationState("success");
      } catch (error: any) {
        setErrorMessage(error.message || t("failedToVerifyEmail"));
        setVerificationState("error");
      }
    };

    verifyEmail();
  }, [params.token, searchParams, t]);

  if (verificationState === "loading" || isLoading) {
    return <VerificationLoading />;
  }

  if (verificationState === "error") {
    return <VerificationError message={errorMessage} />;
  }

  return <VerificationSuccess />;
};

export default Page;

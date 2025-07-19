import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VerificationLoading() {
  const t = useTranslations("auth.emailVerification");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">{t("verifyingAccount")}</p>
      </div>
    </div>
  );
}

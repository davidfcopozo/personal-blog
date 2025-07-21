"use client";
import NotificationPreferences from "@/components/notification-preferences";
import { useTranslations } from "next-intl";

export default function NotificationSettingsPage() {
  const t = useTranslations("notificationSettings");

  return (
    <div className="container mt-16 mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>
      <NotificationPreferences />
    </div>
  );
}

"use client";
import NotificationPreferences from "@/components/notification-preferences";

export default function NotificationSettingsPage() {
  return (
    <div className="container mt-16 mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Notification Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage how you receive notifications about activity on your posts and
          mentions.
        </p>
      </div>
      <NotificationPreferences />
    </div>
  );
}

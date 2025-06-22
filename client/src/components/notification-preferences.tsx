"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Switch } from "./ui/switch";
import { NotificationPreferencesInterface } from "@/typings/interfaces";

const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] =
    useState<NotificationPreferencesInterface>({
      mentions: { inApp: true, email: true },
      comments: { inApp: true, email: true },
      replies: { inApp: true, email: true },
      bookmarks: { inApp: true, email: false },
      likes: { inApp: true, email: false },
    });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);
  const fetchPreferences = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/preferences", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }

      const data = await response.json();
      setPreferences(data.preferences.preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notification preferences",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updatePreferences = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (
    type: keyof NotificationPreferencesInterface,
    channel: "inApp" | "email",
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: value,
      },
    }));
  };

  const notificationTypes = [
    {
      key: "mentions" as const,
      title: "Mentions",
      description: "When someone mentions you in a comment or reply",
    },
    {
      key: "comments" as const,
      title: "Comments",
      description: "When someone comments on your posts",
    },
    {
      key: "replies" as const,
      title: "Replies",
      description: "When someone replies to your comments",
    },
    {
      key: "bookmarks" as const,
      title: "Bookmarks",
      description: "When someone bookmarks your posts",
    },
    {
      key: "likes" as const,
      title: "Likes",
      description: "When someone likes your posts",
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about different activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium">
          <div>Notification Type</div>
          <div className="text-center">In-App</div>
          <div className="text-center">Email</div>
        </div>

        {notificationTypes.map((type) => (
          <div
            key={type.key}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b last:border-b-0"
          >
            <div>
              <h4 className="font-medium">{type.title}</h4>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>{" "}
            <div className="flex justify-center">
              <Switch
                checked={preferences[type.key].inApp}
                onCheckedChange={(value: boolean) =>
                  handlePreferenceChange(type.key, "inApp", value)
                }
              />
            </div>
            <div className="flex justify-center">
              <Switch
                checked={preferences[type.key].email}
                onCheckedChange={(value: boolean) =>
                  handlePreferenceChange(type.key, "email", value)
                }
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button onClick={updatePreferences} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
